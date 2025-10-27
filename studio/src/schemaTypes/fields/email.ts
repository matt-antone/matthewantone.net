import { defineField } from "sanity";

export const email = defineField({
	name: 'email',
	title: 'Email',
	type: 'string',
	description: "Enter a valid email address.",
	validation: Rule =>
		Rule.regex(
			/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
			{
				name: "email",
				invert: false,
			}
		),
})