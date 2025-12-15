import MainLayout from "@/layout/MainLayout";
import { Link } from "react-router-dom";
import { Settings, UserCircle, Heart, ShoppingBag } from "lucide-react";

export default function AccountPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-8 flex items-center gap-3">
          <UserCircle className="h-6 w-6 text-black" />
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gray-500">Account</p>
            <h1 className="text-3xl font-semibold text-black">Profile & Settings</h1>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-black" />
              <div>
                <h2 className="text-lg font-semibold text-black">Account details</h2>
                <p className="text-sm text-gray-600">Update your personal info soon</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              This page is ready for profile details once the API is connected. In the meantime, you can keep shopping or review your orders.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/orders"
                className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                View Orders
              </Link>
              <Link
                to="/collections"
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
              >
                Shop Now
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-black" />
              <div>
                <h2 className="text-lg font-semibold text-black">Quick links</h2>
                <p className="text-sm text-gray-600">Jump to key pages</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 text-sm font-semibold text-gray-800">
              <Link className="rounded-md bg-gray-50 px-4 py-3 transition hover:bg-gray-100" to="/cart">
                Go to Cart
              </Link>
              <Link className="rounded-md bg-gray-50 px-4 py-3 transition hover:bg-gray-100" to="/wishlist">
                <span className="inline-flex items-center gap-2"><Heart className="h-4 w-4" />Wishlist</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
