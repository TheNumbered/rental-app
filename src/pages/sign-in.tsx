
import { CenteredLayout } from "@/components";
import { SignIn } from "@clerk/clerk-react";

export const SignInPage = () => {
    return (
        <CenteredLayout>
            <SignIn forceRedirectUrl={"/dashboard"}/>
        </CenteredLayout>
    )
}