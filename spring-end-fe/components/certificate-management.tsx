'use client'

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface Category {
    id: number
    name: string
    descriptions: string
}

interface Certificate {
    id: string
    certName: string
    cost: number
    categoryid: Category
}

// Define the validation schema
const formSchema = z.object({
  id: z.string()
    .min(1, "Id must be not empty!")
    .max(12, "Id cannot exceed 12 characters!")
    .regex(/^[a-zA-Z0-9-]+$/, "Id can only contain letters, numbers, and hyphens"),
  certName: z.string()
    .min(1, "Certification name must be not empty!")
    .max(255, "Certification name cannot exceed 255 characters!"),
  cost: z.string()
    .min(1, "Cost must be not empty!")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 0 && num <= 9999.9;
      },
      "Cost must be a number between 0 and 9999.9"
    ),
  categoryid: z.object({
    id: z.number(),
    name: z.string(),
    descriptions: z.string()
  }).nullable().refine(val => val !== null, "Category must be selected!")
})

// Update the interface for classification data
interface ClassificationResult {
    name: string;
    certCount: number;
}

export default function CertificateManagement() {
    const queryClient = useQueryClient()
    const [currentPage, setCurrentPage] = React.useState(1)
    const itemsPerPage = 5

    // Fetch certificates
    const { data: certificates = [], isLoading, error } = useQuery({
        queryKey: ['certificates'],
        queryFn: async () => {
            const response = await fetch('http://localhost:8080/api/v1/cert')
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.json()
        }
    })

    // Add query to fetch categories
    const { data: categories = [] } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await fetch('http://localhost:8080/api/v1/category')
            if (!response.ok) {
                throw new Error('Failed to fetch categories')
            }
            return response.json()
        }
    })

    // Create mutation
    const createMutation = useMutation({
        mutationFn: async (newCertificate: z.infer<typeof formSchema>) => {
            const response = await fetch('http://localhost:8080/api/v1/cert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: newCertificate.id,
                    certName: newCertificate.certName,
                    cost: Number(newCertificate.cost),
                    categoryidName: newCertificate.categoryid.name
                }),
            })
            if (!response.ok) {
                throw new Error('Failed to create certificate')
            }
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['certificates'] })
            form.reset() // Reset form after successful creation
        }
    })

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`http://localhost:8080/api/v1/cert/${id}`, {
                method: 'DELETE',
            })
            if (!response.ok) {
                throw new Error('Failed to delete certificate')
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['certificates'] })
        }
    })

    // Calculate pagination
    const totalPages = Math.ceil((certificates?.length || 0) / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentCertificates = certificates.slice(startIndex, endIndex)

    // Replace useState with useForm
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
            certName: "",
            cost: "",
            categoryid: null
        }
    })

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        createMutation.mutate(values)
    }

    const handleCategoryChange = (categoryId: number) => {
        const selectedCategory = categories.find(cat => cat.id === categoryId)
        if (selectedCategory) {
            form.setValue('categoryid', selectedCategory)
        }
    }

    // Add this state for managing the dialog
    const [deleteId, setDeleteId] = React.useState<string | null>(null)

    // Update the delete handlers
    const handleDeleteClick = (id: string) => {
        setDeleteId(id)
    }

    const handleConfirmDelete = () => {
        if (deleteId) {
            deleteMutation.mutate(deleteId)
            setDeleteId(null)
        }
    }

    const handleCancelDelete = () => {
        setDeleteId(null)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }




    // Add a state to track if we're in edit mode
    const [isEditing, setIsEditing] = React.useState(false)

    // Update handleIdClick to set editing mode
    const handleIdClick = (cert: Certificate) => {
        setIsEditing(true)
        form.reset({
            id: cert.id,
            certName: cert.certName,
            cost: cert.cost.toString(),
            categoryid: cert.categoryid
        })
    }

    // Update handleReset to clear editing mode
    const handleReset = () => {
        setIsEditing(false)
        form.reset({
            id: "",
            certName: "",
            cost: "",
            categoryid: null
        })
    }

    // Add these states near other state declarations
    const [showClassifyModal, setShowClassifyModal] = React.useState(false);
    const [classificationData, setClassificationData] = React.useState<ClassificationResult[]>([]);

    // Add the classification query
    const classifyMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch('http://localhost:8080/api/v1/category/classify')
            if (!response.ok) {
                throw new Error('Failed to fetch classification')
            }
            return response.json()
        },
        onSuccess: (data) => {
            setClassificationData(data)
            setShowClassifyModal(true)
        }
    })

    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error.message}</div>

    return (
        <div className="container mx-auto py-6 space-y-8 px-10">
            <div>
                <h1 className="text-2xl font-semibold text-blue-500">IT CERTIFICATE MANAGEMENT</h1>
                <div className="border-b border-orange-300 mt-2"></div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="id"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="font-bold font-medium">
                                    Cert Id <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        {...field} 
                                        placeholder="Id" 
                                        readOnly={isEditing}
                                        className={isEditing ? "bg-gray-100" : ""}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="cost"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="font-bold font-medium">
                                    Cost <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" step="0.01" placeholder="Cost" />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="certName"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="font-bold font-medium">
                                    Certification Name <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Certification Name" />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="categoryid"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="font-bold font-medium">
                                    Category <span className="text-red-500">*</span>
                                </FormLabel>
                                <Select 
                                    value={field.value?.id.toString()} 
                                    onValueChange={(value) => handleCategoryChange(Number(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem 
                                                key={category.id} 
                                                value={category.id.toString()}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <div className="col-span-2 flex justify-end gap-2">
                        <Button 
                            type="submit" 
                            className="bg-blue-500 hover:bg-blue-600"
                            disabled={createMutation.isPending}
                        >
                            {createMutation.isPending ? 'Saving...' : 'Save'}
                        </Button>
                        <Button 
                            type="button" 
                            variant="destructive" 
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                        <Button 
                            type="button" 
                            variant="warning" 
                            className="bg-yellow-500 hover:bg-yellow-600"
                            onClick={() => classifyMutation.mutate()}
                            disabled={classifyMutation.isPending}
                        >
                            {classifyMutation.isPending ? 'Classifying...' : 'Classify'}
                        </Button>
                    </div>
                </form>
            </Form>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-orange-100">
                            <TableHead className="font-bold text-black">Id</TableHead>
                            <TableHead className="font-bold text-black">Certification name</TableHead>
                            <TableHead className="font-bold text-black">Cost ($)</TableHead>
                            <TableHead className="font-bold text-black">Category</TableHead>
                            <TableHead className="font-bold text-black">Delete</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentCertificates.map((cert) => (
                            <TableRow key={cert.id}>
                                <TableCell>
                                    <Button
                                        variant="link"
                                        className="text-blue-500 hover:text-blue-700 p-0 h-auto font-normal"
                                        onClick={() => handleIdClick(cert)}
                                    >
                                        {cert.id}
                                    </Button>
                                </TableCell>
                                <TableCell>{cert.certName}</TableCell>
                                <TableCell>{cert.cost.toFixed(1)}</TableCell>
                                <TableCell>{cert.categoryid.name}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="link"
                                        className="text-blue-500 hover:text-blue-700"
                                        onClick={() => handleDeleteClick(cert.id)}
                                        disabled={deleteMutation.isPending}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious 
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                            <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext 
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            Do you want to delete the record?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="default"
                            className="bg-blue-500 hover:bg-blue-600"
                            onClick={handleConfirmDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? 'Deleting...' : 'OK'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancelDelete}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add the classification modal */}
            <Dialog open={showClassifyModal} onOpenChange={setShowClassifyModal}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Certification Management</DialogTitle>
                        <div className="border-b border-gray-200 pt-2"></div>
                        <DialogDescription className="pt-4">
                            Total of certificates by the category
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-100">
                                    <TableHead className="font-bold">#</TableHead>
                                    <TableHead className="font-bold">Category</TableHead>
                                    <TableHead className="font-bold text-center">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {classificationData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-bold">{index + 1}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell className="text-center">{item.certCount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="border-t border-gray-200 mt-4"></div>
                    <DialogFooter className="mt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowClassifyModal(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

