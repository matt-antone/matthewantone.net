import { isValidPhoneNumber } from 'libphonenumber-js'
import { defineField } from 'sanity'

export const phone = defineField({
  name: 'phone',
  title: 'Phone',
  type: 'string',
  description: 'Enter a valid phone number in the format +1(123) 456-7890',
  validation: Rule => Rule.custom((phone: any) => {
    if (typeof phone === 'undefined') {
      return true // Allow undefined values
    }
    const phoneString = String(phone);
    return isValidPhoneNumber(phoneString) ? true : 'Please enter a valid phone number';
  })
})