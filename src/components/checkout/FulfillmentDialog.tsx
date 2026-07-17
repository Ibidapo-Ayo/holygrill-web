import { useEffect, useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, Clock, Home, LocateFixed, MapPin, Phone, StickyNote, Trash2, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { type AuthAddress } from '@/lib/api/auth';
import { useAuthAddressesQuery, useDeleteAuthAddress, useSaveAuthAddress } from '@/hooks/useAuthAddresses';
import { calculateDeliveryFee } from '@/lib/api/delivery';
import { useFulfillmentStore } from '@/stores/fulfillmentStore';
import { ActionSpinner } from '@/components/ui/ActionSpinner';
import { DELIVERY_FEE, formatPrice } from '@/data/menu';

interface FulfillmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DeliveryFormState {
  addressId?: string;
  streetAddress: string;
  city: string;
  state: string;
  landmark: string;
  label: 'Home' | 'Pickup';
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

const PICKUP_SLOTS = [
  '10:00 AM - 12:00 PM',
  '12:00 PM - 2:00 PM',
  '2:00 PM - 4:00 PM',
  '4:00 PM - 6:00 PM',
];

const EMPTY_DELIVERY_FORM: DeliveryFormState = {
  streetAddress: '',
  city: 'Akure',
  state: 'Ondo',
  landmark: '',
  label: 'Home',
  isDefault: true,
  latitude: undefined,
  longitude: undefined,
};

function toDeliveryForm(address: AuthAddress): DeliveryFormState {
  return {
    addressId: address.id,
    streetAddress: address.address_line,
    city: address.city,
    state: address.state,
    landmark: address.landmark ?? '',
    label: address.label,
    isDefault: address.is_default,
    latitude: address.latitude,
    longitude: address.longitude,
  };
}

export function FulfillmentDialog({ open, onOpenChange }: FulfillmentDialogProps) {
  const {
    method,
    deliveryInfo,
    pickupInfo,
    saveDelivery,
    savePickup,
    clearDelivery,
    setDeliveryCoordinates,
    setEstimatedDeliveryFee,
    setMethod,
  } = useFulfillmentStore();
  const addressesQuery = useAuthAddressesQuery({ enabled: open });
  const saveAddressMutation = useSaveAuthAddress();
  const deleteAddressMutation = useDeleteAuthAddress();
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const savedAddresses = useMemo(() => addressesQuery.data ?? [], [addressesQuery.data]);
  const firstSavedAddress = savedAddresses[0];

  const [deliveryForm, setDeliveryForm] = useState<DeliveryFormState>(
    deliveryInfo
      ? {
          addressId: deliveryInfo.addressId,
          streetAddress: deliveryInfo.streetAddress,
          city: deliveryInfo.city,
          state: deliveryInfo.state,
          landmark: deliveryInfo.landmark ?? '',
          label: deliveryInfo.label,
          isDefault: deliveryInfo.isDefault,
          latitude: deliveryInfo.latitude,
          longitude: deliveryInfo.longitude,
        }
      : EMPTY_DELIVERY_FORM,
  );
  const [pickupForm, setPickupForm] = useState(
    pickupInfo ?? {
      name: '',
      phone: '',
      riderName: '',
      pickupDate: '',
      pickupWindow: '',
      restaurantAddress: '',
      note: '',
    },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activeTab = useMemo(() => method, [method]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (deliveryInfo) {
      setDeliveryForm({
        addressId: deliveryInfo.addressId,
        streetAddress: deliveryInfo.streetAddress,
        city: deliveryInfo.city,
        state: deliveryInfo.state,
        landmark: deliveryInfo.landmark ?? '',
        label: deliveryInfo.label,
        isDefault: deliveryInfo.isDefault,
        latitude: deliveryInfo.latitude,
        longitude: deliveryInfo.longitude,
      });
      return;
    }

    if (firstSavedAddress) {
      setDeliveryForm(toDeliveryForm(firstSavedAddress));
      return;
    }

    setDeliveryForm(EMPTY_DELIVERY_FORM);
  }, [deliveryInfo, firstSavedAddress, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!Number.isFinite(deliveryInfo?.latitude) || !Number.isFinite(deliveryInfo?.longitude)) {
      return;
    }

    setDeliveryForm((current) => ({
      ...current,
      latitude: deliveryInfo?.latitude,
      longitude: deliveryInfo?.longitude,
    }));
  }, [deliveryInfo?.latitude, deliveryInfo?.longitude, open]);

  const validateDelivery = () => {
    const nextErrors: Record<string, string> = {};

    if (!deliveryForm.streetAddress.trim()) nextErrors.streetAddress = 'Address is required';
    if (!deliveryForm.city.trim()) nextErrors.city = 'City is required';
    if (!deliveryForm.state.trim()) nextErrors.state = 'State is required';
    if (!Number.isFinite(deliveryForm.latitude) || !Number.isFinite(deliveryForm.longitude)) {
      nextErrors.coordinates = 'Use your location first to capture latitude and longitude';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validatePickup = () => {
    const nextErrors: Record<string, string> = {};
    if (!pickupForm.name.trim()) nextErrors.name = 'Name is required';
    if (!pickupForm.phone.trim()) nextErrors.phone = 'Phone is required';
    else if (!/^0[789]\d{9}$/.test(pickupForm.phone.trim())) nextErrors.phone = 'Enter a valid Nigerian phone number';
    if (!pickupForm.pickupDate.trim()) nextErrors.pickupDate = 'Date is required';
    if (!pickupForm.pickupWindow.trim()) nextErrors.pickupWindow = 'Select a window';
    if (!pickupForm.restaurantAddress.trim()) nextErrors.restaurantAddress = 'Address is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleDeliverySave = () => {
    if (!validateDelivery()) {
      return;
    }

    saveAddressMutation.mutate(
      {
        addressId: deliveryForm.addressId,
        payload: {
          address_line: deliveryForm.streetAddress.trim(),
          city: deliveryForm.city.trim(),
          state: deliveryForm.state.trim(),
          landmark: deliveryForm.landmark.trim(),
          label: deliveryForm.label,
          is_default: deliveryForm.isDefault,
          latitude: deliveryForm.latitude as number,
          longitude: deliveryForm.longitude as number,
        },
      },
      {
        onError: () => {
          toast.error('Unable to save your address right now. Please try again.');
        },
        onSuccess: (savedAddress) => {
          saveDelivery({
            addressId: savedAddress.id,
            streetAddress: savedAddress.address_line,
            city: savedAddress.city,
            state: savedAddress.state,
            landmark: savedAddress.landmark ?? '',
            label: savedAddress.label,
            isDefault: savedAddress.is_default,
            latitude: savedAddress.latitude,
            longitude: savedAddress.longitude,
          });
          toast.success('Delivery address saved');
          onOpenChange(false);
        },
      },
    );
  };

  const handleDeleteSavedAddress = () => {
    const addressId = deliveryForm.addressId ?? firstSavedAddress?.id;

    if (!addressId) {
      toast.error('No saved address found to delete.');
      return;
    }

    deleteAddressMutation.mutate(addressId, {
      onError: () => {
        toast.error('Unable to delete this saved address right now.');
      },
      onSuccess: () => {
        clearDelivery();
        setDeliveryForm(EMPTY_DELIVERY_FORM);
        setErrors({});
        toast.success('Saved address deleted.');
      },
    });
  };

  const handleSelectAddress = async (address: AuthAddress) => {
    const selected = toDeliveryForm(address);
    setDeliveryForm(selected);
    saveDelivery({
      addressId: address.id,
      streetAddress: address.address_line,
      city: address.city,
      state: address.state,
      landmark: address.landmark ?? '',
      label: address.label,
      isDefault: address.is_default,
      latitude: address.latitude,
      longitude: address.longitude,
    });

    try {
      const fee = await calculateDeliveryFee({
        delivery_location_id: address.id,
        delivery_type: 'on_campus',
        lat: address.latitude,
        lon: address.longitude,
      });
      setEstimatedDeliveryFee(fee);
    } catch {
      setEstimatedDeliveryFee(DELIVERY_FEE);
    }

    toast.success('Address selected.');
  };

  const handleEditAddress = (address: AuthAddress) => {
    setMethod('delivery');
    setDeliveryForm(toDeliveryForm(address));
    setErrors({});
  };

  const handleDeleteAddress = (addressId: string) => {
    deleteAddressMutation.mutate(addressId, {
      onError: () => {
        toast.error('Unable to delete this saved address right now.');
      },
      onSuccess: () => {
        if ((deliveryForm.addressId ?? firstSavedAddress?.id) === addressId) {
          clearDelivery();
          setDeliveryForm(EMPTY_DELIVERY_FORM);
        }
        setErrors({});
        toast.success('Saved address deleted.');
      },
    });
  };

  const handlePickupSave = () => {
    if (!validatePickup()) return;
    savePickup({
      name: pickupForm.name.trim(),
      phone: pickupForm.phone.trim(),
      riderName: pickupForm.riderName?.trim(),
      pickupDate: pickupForm.pickupDate.trim(),
      pickupWindow: pickupForm.pickupWindow.trim(),
      restaurantAddress: pickupForm.restaurantAddress.trim(),
      note: pickupForm.note?.trim(),
    });
    toast.success('Pickup info saved');
    onOpenChange(false);
  };

  const handleUseLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      toast.error('Location is not supported on this device/browser.');
      return;
    }

    setMethod('delivery');
    setIsLocatingUser(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const locationId = deliveryForm.addressId ?? firstSavedAddress?.id;

        if (!locationId) {
          setDeliveryCoordinates(latitude, longitude);
          setEstimatedDeliveryFee(DELIVERY_FEE);
          setIsLocatingUser(false);
          toast.success('Location captured. Delivery fee will be finalized after address save.');
          return;
        }

        let fee = DELIVERY_FEE;

        try {
          fee = await calculateDeliveryFee({
            delivery_location_id: locationId,
            delivery_type: 'on_campus',
            lat: latitude,
            lon: longitude,
          });
        } catch {
          toast.error('Unable to fetch delivery fee right now. We will use base delivery fee temporarily.');
        }

        setDeliveryCoordinates(latitude, longitude);
        setEstimatedDeliveryFee(fee);
        setIsLocatingUser(false);

        toast.success(`Location captured. Delivery fee estimated at ${formatPrice(fee)}.`);
      },
      () => {
        setIsLocatingUser(false);
        toast.error('Unable to access your location. Please allow location permission and try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl w-full p-0 overflow-hidden rounded-t-2xl sm:rounded-lg
                   left-1/2 top-auto bottom-0 translate-x-[-50%] translate-y-0
                   sm:top-1/2 sm:bottom-auto sm:translate-y-[-50%]
                   max-h-[85vh] sm:max-h-[90vh] data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:slide-out-to-bottom-4"
      >
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="font-display text-xl">Delivery or Pickup</DialogTitle>
          <p className="text-sm text-muted-foreground font-body">
            Choose your fulfillment method, fill the form, and we will remember it for checkout.
          </p>
        </DialogHeader>

        <div className="px-6 pb-6">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(val) => setMethod(val as 'delivery' | 'pickup')}>
            <TabsList className="mb-4">
              <TabsTrigger value="delivery" className="gap-2">
                <Home size={14} /> Home Delivery
              </TabsTrigger>
              <TabsTrigger value="pickup" className="gap-2">
                <Clock size={14} /> Pickup Window
              </TabsTrigger>
            </TabsList>

            <TabsContent value="delivery">
              <div className="mb-3 text-xs text-muted-foreground font-body">
                {addressesQuery.isLoading ? 'Checking saved addresses...' : null}
                {firstSavedAddress
                  ? ` Displaying first saved address: ${firstSavedAddress.address_line}, ${firstSavedAddress.city}`
                  : null}
              </div>

              {savedAddresses.length > 1 ? (
                <div className="mb-4 space-y-2 rounded-lg border border-border bg-secondary/40 p-3">
                  <p className="text-xs font-semibold text-muted-foreground">Saved addresses</p>
                  {savedAddresses.map((address, index) => {
                    const isActive = (deliveryForm.addressId ?? firstSavedAddress?.id) === address.id;

                    return (
                      <div
                        key={address.id}
                        className={`rounded-lg border px-3 py-2 ${isActive ? 'border-primary/60 bg-primary/5' : 'border-border bg-background/70'}`}
                      >
                        <p className="text-xs text-muted-foreground">Address {index + 1}</p>
                        <p className="text-sm font-semibold text-foreground">{address.address_line}</p>
                        <p className="text-xs text-muted-foreground">{address.city}, {address.state}</p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => void handleSelectAddress(address)}
                            className="rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-secondary"
                          >
                            {isActive ? 'Selected' : 'Select'}
                          </button>
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-secondary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            disabled={deleteAddressMutation.isPending}
                            className="rounded-md border border-destructive/40 px-2.5 py-1 text-xs font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-70"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-1">
                    <MapPin size={14} className="text-primary" />
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={deliveryForm.streetAddress}
                    onChange={(event) => setDeliveryForm((prev) => ({ ...prev, streetAddress: event.target.value }))}
                    placeholder="e.g. Obakekere, behind FUTA gate"
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {errors.streetAddress ? <p className="text-destructive text-xs font-body mt-1">{errors.streetAddress}</p> : null}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-1">
                    <Home size={14} className="text-primary" />
                    City
                  </label>
                  <input
                    type="text"
                    value={deliveryForm.city}
                    onChange={(event) => setDeliveryForm((prev) => ({ ...prev, city: event.target.value }))}
                    placeholder="Akure"
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {errors.city ? <p className="text-destructive text-xs font-body mt-1">{errors.city}</p> : null}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-1">
                    <Home size={14} className="text-primary" />
                    State
                  </label>
                  <input
                    type="text"
                    value={deliveryForm.state}
                    onChange={(event) => setDeliveryForm((prev) => ({ ...prev, state: event.target.value }))}
                    placeholder="Ondo"
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {errors.state ? <p className="text-destructive text-xs font-body mt-1">{errors.state}</p> : null}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-1">
                    <StickyNote size={14} className="text-primary" />
                    Landmark (optional)
                  </label>
                  <input
                    type="text"
                    value={deliveryForm.landmark}
                    onChange={(event) => setDeliveryForm((prev) => ({ ...prev, landmark: event.target.value }))}
                    placeholder="Near..."
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-1">Label</label>
                  <select
                    value={deliveryForm.label}
                    onChange={(event) => setDeliveryForm((prev) => ({ ...prev, label: event.target.value as 'Home' | 'Pickup' }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="Home">Home</option>
                    <option value="Pickup">Pickup</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-1">Default address</label>
                  <label className="inline-flex items-center gap-2 text-sm font-body text-foreground">
                    <input
                      type="checkbox"
                      checked={deliveryForm.isDefault}
                      onChange={(event) => setDeliveryForm((prev) => ({ ...prev, isDefault: event.target.checked }))}
                    />
                    Set as default
                  </label>
                </div>
              </div>

              <div className="mt-3 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs text-muted-foreground font-body">
                Coordinates: {Number.isFinite(deliveryForm.latitude) && Number.isFinite(deliveryForm.longitude)
                  ? `${deliveryForm.latitude?.toFixed(6)}, ${deliveryForm.longitude?.toFixed(6)}`
                  : 'Not captured yet. Use my location before saving home delivery.'}
              </div>
              {errors.coordinates ? <p className="text-destructive text-xs font-body mt-1">{errors.coordinates}</p> : null}

              <div className="mt-3">
                <button
                  onClick={handleUseLocation}
                  disabled={isLocatingUser}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLocatingUser ? <ActionSpinner size="sm" tone="fire" /> : <LocateFixed size={14} />}
                  {isLocatingUser ? 'Capturing location...' : 'Use my location'}
                </button>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                  <CheckCircle2 size={14} className="text-success" />
                  Home delivery requires location capture before save.
                </div>
                <div className="flex items-center gap-2">
                  {(deliveryForm.addressId ?? firstSavedAddress?.id) ? (
                    <button
                      onClick={handleDeleteSavedAddress}
                      disabled={deleteAddressMutation.isPending}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-destructive/40 text-destructive font-display font-bold text-sm hover:bg-destructive/10 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {deleteAddressMutation.isPending ? <ActionSpinner size="sm" tone="muted" /> : <Trash2 size={14} />}
                      {deleteAddressMutation.isPending ? 'Deleting...' : 'Delete Saved Address'}
                    </button>
                  ) : null}

                  <button
                    onClick={handleDeliverySave}
                    disabled={
                      saveAddressMutation.isPending ||
                      !Number.isFinite(deliveryForm.latitude) ||
                      !Number.isFinite(deliveryForm.longitude)
                    }
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm hover:bg-primary-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {saveAddressMutation.isPending ? 'Saving...' : 'Save Delivery Info'}
                  </button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pickup">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Your Name', placeholder: 'e.g. Ada Lovelace', icon: UserRound },
                  { key: 'phone', label: 'Phone Number', placeholder: '08012345678', icon: Phone },
                  { key: 'riderName', label: "Rider's Name (optional)", placeholder: 'Who is picking up?', icon: UserRound },
                  { key: 'pickupDate', label: 'Pickup Date', placeholder: 'Select a date', icon: Clock, type: 'date' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-1">
                      <field.icon size={14} className="text-primary" />
                      {field.label}
                    </label>
                    <input
                      type={field.type || 'text'}
                      value={pickupForm[field.key as keyof typeof pickupForm]}
                      onChange={(event) => setPickupForm((prev) => ({ ...prev, [field.key]: event.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {errors[field.key] ? <p className="text-destructive text-xs font-body mt-1">{errors[field.key]}</p> : null}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-1">
                    <Clock size={14} className="text-primary" />
                    Pickup Window
                  </label>
                  <select
                    value={pickupForm.pickupWindow}
                    onChange={(event) => setPickupForm((prev) => ({ ...prev, pickupWindow: event.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select a window</option>
                    {PICKUP_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  {errors.pickupWindow ? <p className="text-destructive text-xs font-body mt-1">{errors.pickupWindow}</p> : null}
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-1">
                    <MapPin size={14} className="text-primary" />
                    Restaurant Address
                  </label>
                  <input
                    type="text"
                    value={pickupForm.restaurantAddress}
                    onChange={(event) => setPickupForm((prev) => ({ ...prev, restaurantAddress: event.target.value }))}
                    placeholder="Opposite FUTA South Gate..."
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {errors.restaurantAddress ? <p className="text-destructive text-xs font-body mt-1">{errors.restaurantAddress}</p> : null}
                </div>
              </div>

              <div className="mt-3">
                <label className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-1">
                  <StickyNote size={14} className="text-primary" />
                  Notes (optional)
                </label>
                <textarea
                  value={pickupForm.note}
                  onChange={(event) => setPickupForm((prev) => ({ ...prev, note: event.target.value }))}
                  placeholder="Anything we should know? e.g. rider will call on arrival."
                  className="w-full min-h-[100px] px-3 py-3 rounded-lg bg-secondary border border-border text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                  <CheckCircle2 size={14} className="text-success" />
                  We will prep your order to hit the window you select.
                </div>
                <button
                  onClick={handlePickupSave}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm hover:bg-primary-hover transition-colors"
                >
                  Save Pickup Info
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
