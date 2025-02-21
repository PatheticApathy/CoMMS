"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "cmdk"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover"
import { Key } from "react"


export function ComboboxFormField({ form_attr, default_label, options }: { form_attr: { name: string, description: string, form: UseFormReturn<any> }, default_label: string, options: { label: string, value: Key }[] }) {

  const { name, description, form } = { ...form_attr }
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (<FormItem className="flex flex-col gap-2">
        <FormDescription>
          {description}
        </FormDescription>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-[200px] justify-between",
                  !field.value && "text-muted-foreground"
                )}
              >
                {field.value
                  ? options.find(
                    (option) => option.value === field.value
                  )?.label
                  : default_label}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="bg-stone-600  p-0">
            <Command>
              <CommandInput placeholder="Search..." />
              <CommandList>
                <CommandEmpty>No options found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      value={option.label}
                      key={option.value}
                      onSelect={() => {
                        form.setValue(name, option.value)
                      }}
                    >
                      {option.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          option.value === field.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
      )}
    />
  )
}