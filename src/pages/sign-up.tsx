import { CenteredLayout } from "@/components"
import { SignUp } from "@clerk/clerk-react"

export const SignUpPage = () => {
    return (
        <CenteredLayout>
            <SignUp forceRedirectUrl={"/dashboard"} />
        </CenteredLayout>
    )
}