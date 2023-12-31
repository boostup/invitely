import { RocketIcon } from "@radix-ui/react-icons"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/shadcn-components/ui/alert"

export const MessageBox = ({ title, message }) => (
    <Alert>
        <RocketIcon className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
            {message}
        </AlertDescription>
    </Alert>
)