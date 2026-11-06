import { NotFoundRouter } from "@/components/layout/not-found-router";
import StoreLayout from "./(store)/layout";
import StoreNotFound from "./(store)/not-found";
import AdminLayout from "./admin/layout";
import AdminNotFound from "./admin/not-found";

/** Unknown URLs land here, keeping the store or admin shell around the message. */
export default function NotFound() {
  return (
    <NotFoundRouter
      store={
        <StoreLayout>
          <StoreNotFound />
        </StoreLayout>
      }
      admin={
        <AdminLayout>
          <AdminNotFound />
        </AdminLayout>
      }
    />
  );
}
