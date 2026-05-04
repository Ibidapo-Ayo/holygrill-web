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

export enum FormFieldTypes {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton',
    CHECKBOX = 'checkbox',
}

interface CustomProps {
    control: Control<FieldValues>
    fieldType: FormFieldTypes
    name: string
    placeholder?: string
    iconSrc?: string
    iconAlt?: string
    label?: string
    disabled?: boolean
    dateFormat?: string
    showTimeSelect?: boolean
    children?: React.ReactNode
    renderSkeleton?: (field: unknown) => React.ReactNode
}

const RenderField = ({ field, props }: { field: { value: unknown; onChange: (val: unknown) => void }, props: CustomProps }) => {
    const { fieldType, placeholder, iconSrc, iconAlt, showTimeSelect, dateFormat, renderSkeleton, label, name } = props

    switch (fieldType) {
        case FormFieldTypes.INPUT:
            return (
                <div className="flex rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                    {iconSrc && (
                        <Image
                            src={iconSrc}
                            height={24}
                            width={24}
                            alt={iconAlt ?? 'icon'}
                            className="ml-3 my-auto shrink-0"
                        />
                    )}
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            {...field as React.ComponentProps<typeof Input>}
                            className="shad-input border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                        {...field as React.ComponentProps<typeof Textarea>}
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
                <div className="flex rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                    <Image
                        src="/assets/icons/calendar.svg"
                        height={24}
                        width={24}
                        alt="calendar"
                        className="ml-3 my-auto shrink-0"
                    />
                    <FormControl>
                        <DatePicker
                            selected={field.value as Date | null}
                            onChange={(date) => field.onChange(date)}
                            dateFormat={dateFormat ?? "MM/dd/yyyy"}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value as string | undefined}>
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
