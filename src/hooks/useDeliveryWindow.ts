'use client';

import { useEffect, useState } from 'react';
import type { DeliveryWindowInfo } from '@/types';
import { OPERATING_HOURS } from '@/services/mocks/platform';
import { getDeliveryWindowInfo } from '@/utils/deliveryWindow';

export function useDeliveryWindow() {
  const [info, setInfo] = useState<DeliveryWindowInfo>(() => getDeliveryWindowInfo(new Date(), OPERATING_HOURS));

  useEffect(() => {
    const update = () => setInfo(getDeliveryWindowInfo(new Date(), OPERATING_HOURS));
    update();
    const timer = window.setInterval(update, 30000);
    return () => window.clearInterval(timer);
  }, []);

  return info;
}
