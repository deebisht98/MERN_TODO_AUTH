import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "@tanstack/react-router";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

interface TodoFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    user: string;
  }) => void;
  onClose: () => void;
  initialValues?: { title: string; description: string }; // Add initialValues prop
  isOpen?: boolean; // Add isOpen prop
}

export const TodoForm = ({
  onSubmit,
  onClose,
  initialValues,
  isOpen,
}: TodoFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ title: string; description: string }>({
    resolver: zodResolver(schema),
    defaultValues: initialValues, // Set default values
  });

  const handleFormSubmit = (data: { title: string; description: string }) => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    onSubmit({ ...data, user: user._id });
    reset();
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerClose asChild>
          <button className="mb-10 absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </DrawerClose>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 p-4 mt-4"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <Input
              id="title"
              {...register("title")}
              className="block w-full mt-1 p-2 border rounded"
              autoFocus
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <Textarea
              id="description"
              {...register("description")}
              className="block w-full mt-1 p-2 border rounded"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
          >
            {initialValues ? "Update Todo" : "Add Todo"}
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
