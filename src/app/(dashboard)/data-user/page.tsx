"use client"

import { useState, type ChangeEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TambahUserModal } from "@/components/modals/tambah-user-modal"
import { LihatUserModal } from "@/components/modals/lihat-user-modal"
import { EditUserModal } from "@/components/modals/edit-user-modal"
import { HapusUserModal } from "@/components/modals/hapus-user-modal"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { SearchComponent } from "@/components/ui/SearchComponent"
import * as Tooltip from "@radix-ui/react-tooltip"

interface UserItem {
   id: number
   nama: string
   username: string
   password: string
   photo: string
   nik: string
   alamat: string
   jenis_kelamin: "Laki-laki" | "Perempuan"
   no_hp: string
   role: "Masyarakat"
}

const initialUserData: UserItem[] = [
   {
      id: 1,
      nama: "Bayu Syahputra",
      username: "bayu",
      password: "admin123",
      photo: "/placeholder.svg?height=128&width=128",
      nik: "3507112509870001",
      alamat: "Jl. Desa No. 1, Dusun Sukamaju",
      jenis_kelamin: "Laki-laki",
      no_hp: "081234567890",
      role: "Masyarakat",
   },
   {
      id: 2,
      nama: "Budi Santoso",
      username: "budi",
      password: "budi123",
      photo: "/placeholder.svg?height=128&width=128",
      nik: "3507112509870002",
      alamat: "Jl. Mawar No. 15, Dusun Harapan Jaya",
      jenis_kelamin: "Laki-laki",
      no_hp: "081234567891",
      role: "Masyarakat",
   },
   {
      id: 3,
      nama: "Siti Aminah",
      username: "siti",
      password: "siti123",
      photo: "/placeholder.svg?height=128&width=128",
      nik: "3507112509870003",
      alamat: "Jl. Melati No. 7, Dusun Sukamaju",
      jenis_kelamin: "Perempuan",
      no_hp: "081234567892",
      role: "Masyarakat",
   },
   {
      id: 4,
      nama: "Dedi Kurniawan",
      username: "dedi",
      password: "dedi123",
      photo: "/placeholder.svg?height=128&width=128",
      nik: "3507112509870004",
      alamat: "Jl. Anggrek No. 23, Dusun Harapan Jaya",
      jenis_kelamin: "Laki-laki",
      no_hp: "081234567893",
      role: "Masyarakat",
   },
]

const getRoleBadgeColor = (role: string): string => {
   switch (role) {
      case "Masyarakat":
         return "bg-green-100 text-green-800"
      default:
         return "bg-gray-100 text-gray-800"
   }
}

export default function DataUserPage() {
   const [userData, setUserData] = useState<UserItem[]>(initialUserData)
   const [searchQuery, setSearchQuery] = useState<string>("")
   const { toast } = useToast()

   // Function to handle search input changes
   const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
   }

   // Function to add new user
   const handleAddUser = (newUser: Omit<UserItem, "id">) => {
      const newId = userData.length > 0 ? Math.max(...userData.map((user) => user.id)) + 1 : 1
      setUserData((prev) => [...prev, { id: newId, ...newUser }])
      toast({
         title: "Berhasil",
         description: "User baru berhasil ditambahkan",
      })
   }

   // Function to update user
   const handleUpdateUser = (id: number, updatedUser: Partial<UserItem>) => {
      setUserData((prevData) => prevData.map((user) => (user.id === id ? { ...user, ...updatedUser } : user)))
      toast({
         title: "Berhasil",
         description: "Data user berhasil diperbarui",
      })
   }

   // Function to delete user
   const handleDeleteUser = (id: number) => {
      setUserData((prevData) => prevData.filter((user) => user.id !== id))
      toast({
         title: "Berhasil",
         description: "User berhasil dihapus",
      })
   }

   // Filter data based on search query
   const filteredData = userData.filter((user) => {
      const query = searchQuery.toLowerCase()
      return (
         user.nama.toLowerCase().includes(query) ||
         user.username.toLowerCase().includes(query) ||
         user.nik.toLowerCase().includes(query) ||
         user.alamat.toLowerCase().includes(query) ||
         user.no_hp.includes(query) ||
         user.role.toLowerCase().includes(query)
      )
   })

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold">Data User</h1>
            <p className="text-muted-foreground">Kelola data pengguna sistem</p>
         </div>
         <Tooltip.Provider delayDuration={300}>
            <Tooltip.Root>
               <Tooltip.Trigger asChild>
                  <div className="realtive inline-block">
                     <TambahUserModal onAddUser={handleAddUser} />
                  </div>
               </Tooltip.Trigger>
               <Tooltip.Portal>
                  <Tooltip.Content
                     side="bottom" 
                     sideOffset={6}
                     className="bg-white text-gray-900 text-xs font-medium px-2.5 py-1.5 rounded shadow-md z-50"
                     avoidCollisions
                     collisionPadding={8}
                  >
                     Tambah User Baru
                        <Tooltip.Arrow className="fill-white" width={10} height={5} />
                  </Tooltip.Content>
               </Tooltip.Portal>
            </Tooltip.Root>
         </Tooltip.Provider>
         </div>

         <Card>
         <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
               <div>
               <CardTitle>Daftar User</CardTitle>
               <CardDescription>Daftar pengguna sistem administrasi desa</CardDescription>
               </div>
               <div className="flex items-center gap-2">
                  <div className="relative">
                  <SearchComponent
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                        placeholder="Cari User..."
                  />
                  </div>
               </div>
            </div>
         </CardHeader>
         <CardContent>
            <Table>
               <TableHeader>
               <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>NIK</TableHead>
                  <TableHead>No. HP</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
               </TableRow>
               </TableHeader>
               <TableBody>
               {filteredData.length > 0 ? (
                  filteredData.map((user) => (
                     <TableRow key={user.id}>
                     <TableCell>{user.id}</TableCell>
                     <TableCell>
                        <div className="flex items-center gap-2">
                           <Avatar className="h-8 w-8">
                           <AvatarImage src={user.photo || "/placeholder.svg"} alt={user.nama} />
                           <AvatarFallback className="bg-gray-200"></AvatarFallback>
                           </Avatar>
                           <span>{user.nama}</span>
                        </div>
                     </TableCell>
                     <TableCell>{user.username}</TableCell>
                     <TableCell>{user.nik}</TableCell>
                     <TableCell>{user.no_hp}</TableCell>
                     <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                     </TableCell>
                     <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                           <Tooltip.Provider delayDuration={300}>
                              <Tooltip.Root>
                                 <Tooltip.Trigger>
                                    <LihatUserModal user={user} />
                                 </Tooltip.Trigger>
                                 <Tooltip.Portal>
                                    <Tooltip.Content side="top"
                                    sideOffset={6}
                                    className="bg-white text-gray-900 text-xs font-medium px-2.5 py-1.5 rounded shadow-md z-50"
                                    avoidCollisions
                                    collisionPadding={8}
                                    >
                                       Lihar Data User
                                       <Tooltip.Arrow className="fill-white" width={10} height={5} />
                                    </Tooltip.Content>
                                 </Tooltip.Portal>
                              </Tooltip.Root>
                           </Tooltip.Provider>
                           <Tooltip.Provider delayDuration={300}>
                              <Tooltip.Root>
                                 <Tooltip.Trigger>
                                    <EditUserModal user={user} onUpdateUser={handleUpdateUser} />
                                 </Tooltip.Trigger>
                                 <Tooltip.Portal>
                                    <Tooltip.Content
                                    side="top"
                                    sideOffset={6}
                                    className="bg-white text-gray-900 text-xs font-medium px-2.5 py-1.5 rounded shadow-md z-50"
                                    avoidCollisions
                                    collisionPadding={8}
                                    >
                                       Edit Data User
                                       <Tooltip.Arrow className="fill-white" width={10} height={5} />   
                                    </Tooltip.Content>
                                 </Tooltip.Portal>
                              </Tooltip.Root>
                           </Tooltip.Provider>
                           
                           <Tooltip.Provider delayDuration={300}>
                              <Tooltip.Root>
                                 <Tooltip.Trigger>
                                    <HapusUserModal id={user.id} nama={user.nama} onDeleteUser={handleDeleteUser} />
                                 </Tooltip.Trigger>
                                 <Tooltip.Portal>
                                    <Tooltip.Content
                                    side="top"
                                    sideOffset={6}
                                    className="bg-white text-gray-900 text-xs font-medium px-2.5 py-1.5 rounded shadow-md z-50"
                                    avoidCollisions
                                    collisionPadding={8}
                                    >
                                       Hapus User
                                       <Tooltip.Arrow className="fill-white" width={10} height={5} />
                                    </Tooltip.Content>
                                 </Tooltip.Portal>
                              </Tooltip.Root>
                           </Tooltip.Provider>
                        </div>
                     </TableCell>
                     </TableRow>
                  ))
               ) : (
                  <TableRow>
                     <TableCell colSpan={7} className="text-center py-4">
                     Tidak ada data yang sesuai dengan pencarian
                     </TableCell>
                  </TableRow>
               )}
               </TableBody>
            </Table>
         </CardContent>
         </Card>
      </div>
   )
}
