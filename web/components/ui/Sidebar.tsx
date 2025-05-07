import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { ChevronsLeft, Plus } from "lucide-react";
import SidebarItem from "./SidebarItems";
import { Button } from "./Button";

export function Sidebar() {
  return (
    <div className="w-1/5 h-screen text-white bg-neutral-700 border-r border-neutral-500 p-4 flex flex-col justify-between items-start">
      <div className="flex flex-col justify-start items-start w-full max-h-3/4">
        <h1 className="text-lg mb-5 font-serif">Manimator</h1>
        <SidebarItem className="border-dashed hover:border-solid">
          <Plus size={18} />
          <h3 className="font-sans text-md font-medium">Create New...</h3>
        </SidebarItem>

        <div className="w-full flex flex-col justify-center items-start gap-1 mt-7">
          <h3 className="text-md font-semibold tracking-wide px-2 text-neutral-100">
            Projects
          </h3>

          <SidebarItem className="border-none">
            Matrix Transformation
          </SidebarItem>
        </div>
      </div>
      <div className="flex justify-between items-end w-full">
        <SignedIn>
          <UserButton />
          <Button variant="icon">
            <ChevronsLeft className="m-1" />
          </Button>
        </SignedIn>
        <SignedOut>
          <div className="flex flex-col justify-start items-start gap-3 w-full">
            <SignInButton>
              <Button className="rounded-full w-full py-2">Sign in</Button>
            </SignInButton>
            <SignUpButton>
              <Button
                className="rounded-full w-full py-2"
                variant="destructive"
              >
                Sign up
              </Button>
            </SignUpButton>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}
