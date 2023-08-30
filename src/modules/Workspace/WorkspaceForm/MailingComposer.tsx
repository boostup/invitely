import React from 'react';
import { useLoaderData } from 'react-router';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from "@/shadcn-components/ui/button"
import {
  Form,
} from "@/shadcn-components/ui/form"

import { TextInput } from '../../../shared/components/Form/TextInput';
import { SelectInput, SelectOption } from '../../../shared/components/Form/SelectInput';
import { RichTextInput } from '@/modules/Workspace/WorkspaceForm/RichTextInput';
import { PageActions } from '../../../shared/components/PageActions';
import { getForm } from '../forms';
import { create } from '../recipients';


const defaultRecipients: SelectOption[] = [
  { value: 'abeauvois@gmail.com', label: 'alex: abeauvois@gmail.com' },
  { value: 'boostup@gmail.com', label: 'fred' },
];

const recipientSchema = z.object({
  value: z.string().email().nonempty(),
  label: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }).optional(),
});

const recipientsSchema = z.array(recipientSchema).min(1, {
  message: "You must have at least one recipient.",
})

const emailingSchema = z.object({
  recipients: recipientsSchema,
  subject: z.string().min(2, {
    message: "Subject must be at least 2 characters.",
  }),
  message: z.string().min(2, {
    message: "Message must be at least 2 characters.",
  }),
});

const Header = ({ label = "Envoie du formulaire", backToUrl }) => {
  return (
    <PageActions backTo={{ url: backToUrl, label: "Workspace" }} pageTitle={label} >
    </PageActions >
  )
}

export async function loader({ params }) {
  const { formId } = params;
  const formDataDefault = await getForm({ formId });
  return { formId, formDataDefault };
}

function MailingComposer() {
  const { formId, formDataDefault } = useLoaderData();
  const [recipientsOptions, setRecipientsOptions] = React.useState<SelectOption[]>(defaultRecipients);

  const form = useForm({
    resolver: zodResolver(emailingSchema),
    defaultValues: {
      recipients: recipientsOptions,
      subject: formDataDefault.title,
      message: formDataDefault.description,
    },
  });

  const onSubmit = async ({ subject, message, recipients }) => {
    // @TODO
    //Every recipients captured in the SelectInput must :
    recipients.forEach(async ({ value, label }) => {
      // 1) be stored in the `recipients`
      const recipientId = await create({ emailAddress: value });
      // 2) have an entry with its recipientId in the `answers` section of the form?????
      //      --->   May not be necessary right now
      // 3) A link must be included in the mail sent to each recipient so they can actually fill out this workspace form:
      // 
      const hostname = window.location.hostname;
      let baseUrl = `${window.location.protocol}//${hostname}`;
      if (import.meta.env.DEV) {
        baseUrl += `:${window.location.port}`
      }

      console.log(` \tto:${value} 
                 \n \tsubject:${subject}
                 \n \tmessage (as HTML): \n ${message} 
                 <a href="${baseUrl}/workspace/form/${formId}/${recipientId}" rel="noopener noreferrer" target="_blank">Répondre au questionnaire</a></p> 
                `)

    });

  };

  return (
    <section className="page">
      <Header label={formDataDefault.title} backToUrl={`/workspace/form/${formId}`} />
      <div className="mx-auto max-w-7xl px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <SelectInput fieldLabel='Destinataires' fieldName='recipients' control={form.control} defaultOptions={recipientsOptions} />
            <TextInput fieldLabel='Sujet' fieldName='subject' control={form.control} />
            <RichTextInput fieldLabel='Corps du mail' fieldName='message' control={form.control} />
            <Button type="submit" variant='primary'>Envoyer</Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
export { MailingComposer }