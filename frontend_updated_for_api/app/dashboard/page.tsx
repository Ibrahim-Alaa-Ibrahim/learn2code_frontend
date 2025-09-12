import AuthGuard from "@/lib/auth-guard"
import DashboardClient from "./DashboardClient"

export default function Page() {
  return (
    <AuthGuard>
      <DashboardClient />
    </AuthGuard>
  )
}

