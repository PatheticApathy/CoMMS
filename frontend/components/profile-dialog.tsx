import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
  } from "@/components/ui/dialog"

  import {
    SidebarMenuButton,
  
  } from "@/components/ui/sidebar"

  import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
  } from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

export function Profile() {
    return (
        <Dialog>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                    Account
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    side="top"
                    className="w-[--radix-popper-anchor-width]"
                >     
                    <DialogTrigger asChild>
                        <DropdownMenuItem>
                            <span>Profile</span>
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuItem>
                        <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="w-[400px]">
                <DialogHeader>
                    <DialogTitle>Profile</DialogTitle>
                    <DialogDescription>View your profile here. Click Edit Profile to edit your profile.</DialogDescription>
                </DialogHeader>
                <div className="rounded-full overflow-hidden h-28 w-28">
                    <img className="" src="https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"></img>
                </div>
                <div>Username: Username</div>
                <div>Name: FirstName LastName</div>
                <div>Email: email@place.com</div>
                <div>Phone: 1234567890</div>
                <DialogFooter>
                    <Dialog>
                        <DialogTrigger>
                            <Button>Edit Profile</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                                <DialogDescription>Edit your profile here. Click Save Changes when you're done.</DialogDescription>
                            </DialogHeader>
                            <div className="rounded-full overflow-hidden h-28 w-28">
                                <img className="" src="https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"></img>
                            </div>
                            <Input id="username" defaultValue="Username" required></Input>
                            <Input id="firstname" defaultValue="FirstName" type="text"></Input>
                            <Input id="lastname" defaultValue="LastName" type="text"></Input>
                            <Input id="email" defaultValue="email@place.com" type="email" required></Input>
                            <Input id="phone" defaultValue="1234567890" type="number" required></Input>
                            <DialogFooter>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}