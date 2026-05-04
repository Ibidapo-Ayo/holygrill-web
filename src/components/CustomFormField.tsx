"use client"
import React from 'react'
import { Control, FieldValues } from 'react-hook-form'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { FormFieldTypes } from '@/lib/form-field-type'

interface CustomProps {
    control: Control<FieldValues>
    fieldType: FormFieldTypes
    name: string
    placeholder?: string
    /** Pass a Lucide component or an image path string */
    iconSrc?: string | React.ComponentType<{ size?: number | string; className?: string }>
    iconAlt?: string
    label?: string
    disabled?: boolean
    dateFormat?: string
    showTimeSelect?: boolean
    children?: React.ReactNode
    /** HTML input type, e.g. "text" | "email" | "password" */
    type?: string
    renderSkeleton?: (field: unknown) => React.ReactNode
}

const RenderField = ({
    field,
    props,
}: {
    field: { value: unknown; onChange: (val: unknown) => void }
    props: CustomProps
}) => {
    const {
        fieldType,
        placeholder,
        iconSrc,
        iconAlt,
        showTimeSelect,
        dateFormat,
        renderSkeleton,
        label,
        name,
    } = props

    // Lucide icon component (passed as a React component type)
    const IconComponent =
        iconSrc && typeof iconSrc !== 'string'
            ? (iconSrc as React.ComponentType<{ size?: number | string; className?: string }>)
            : null
    // Image path string (SVG etc.)
    const iconPath = typeof iconSrc === 'string' ? iconSrc : null

    switch (fieldType) {
        case FormFieldTypes.INPUT:
            return (
                <div className="relative">
                    {IconComponent && (
                        <IconComponent
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                    )}
                    {iconPath && (
                        <Image
                            src={iconPath}
                            width={16}
                            height={16}
                            alt={iconAlt ?? 'icon'}
                            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        />
                    )}
                    <FormControl>
                        <Input
                            type={props.type ?? 'text'}
                            placeholder={placeholder}
                            {...(field as React.ComponentProps<typeof Input>)}
                            className="shad-input"
                            disabled={props.disabled}
                        />
                    </FormControl>
                </div>
            )

        case FormFieldTypes.TEXTAREA:
            return (
                <FormControl>
                    <Textarea
                        placeholder={placeholder}
                        {...(field as React.ComponentProps<typeof Textarea>)}
                        className="shad-text-area"
                        disabled={props.disabled}
                    />
                </FormControl>
            )

        case FormFieldTypes.PHONE_INPUT:
            return (
                <FormControl>
                    <PhoneInput
                        placeholder={placeholder}
                        value={field.value as string | undefined}
                        onChange={field.onChange}
                        defaultCountry="US"
                        international
                        withCountryCallingCode
                        className="input-phone"
                    />
                </FormControl>
            )

        case FormFieldTypes.DATE_PICKER:
            return (
                <div className="flex items-center rounded-lg border border-border bg-secondary focus-within:ring-2 focus-within:ring-primary/50 px-3 py-0.5">
                    <Image
                        src="/assets/icons/calendar.svg"
                        height={16}
                        width={16}
                        alt="calendar"
                        className="shrink-0 text-muted-foreground"
                    />
                    <FormControl>
                        <DatePicker
                            selected={field.value as Date | null}
                            onChange={(date) => field.onChange(date)}
                            dateFormat={dateFormat ?? 'MM/dd/yyyy'}
                            showTimeSelect={showTimeSelect ?? false}
                            timeInputLabel="Time:"
                            wrapperClassName="date-picker"
                        />
                    </FormControl>
                </div>
            )

        case FormFieldTypes.SELECT:
            return (
                <FormControl>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value as string | undefined}
                    >
                        <FormControl>
                            <SelectTrigger className="shad-select-trigger">
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="shad-select-content">
                            {props.children}
                        </SelectContent>
                    </Select>
                </FormControl>
            )

        case FormFieldTypes.SKELETON:
            return renderSkeleton ? <>{renderSkeleton(field)}</> : null

        case FormFieldTypes.CHECKBOX:
            return (
                <FormControl>
                    <div className="flex items-center gap-3">
                        <Checkbox
                            id={name}
                            checked={field.value as boolean | undefined}
                            onCheckedChange={field.onChange}
                            disabled={props.disabled}
                        />
                        <label htmlFor={name} className="checkbox-label">
                            {label}
                        </label>
                    </div>
                </FormControl>
            )

        default:
            return null
    }
}

const CustomFormField = (props: CustomProps) => {
    const { control, name, fieldType, label } = props

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex-1 space-y-1">
                    {fieldType !== FormFieldTypes.CHECKBOX && label && (
                        <FormLabel className="shad-form-label">{label}</FormLabel>
                    )}
                    <RenderField field={field} props={props} />
                    <FormMessage className="shad-error" />
                </FormItem>
            )}
        />
    )
}

export default CustomFormField
