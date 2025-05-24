import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import CouponForm from "./enrollments/CouponForm";
import CouponsTable from "./enrollments/CouponsTable";
import EnrollmentForm from "./enrollments/EnrollmentForm";
import EnrollmentsTable from "./enrollments/EnrollmentsTable";
import { useDiscountCoupons, useDiscountCouponActions } from "@/hooks/useDiscountCoupons";
import { useEnrollmentsList, useEnrollmentActions } from "@/hooks/enrollments";

const EnrollmentManagement = () => {
  const [activeTab, setActiveTab] = useState("enrollments");
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [isAddEnrollmentOpen, setIsAddEnrollmentOpen] = useState(false);

  // Cupons de desconto
  const { data: coupons = [], isLoading: isLoadingCoupons } = useDiscountCoupons();
  const { addCoupon } = useDiscountCouponActions();

  // Matrículas manuais
  const { data: enrollments = [], isLoading: isLoadingEnrollments } = useEnrollmentsList();
  const { addEnrollment } = useEnrollmentActions();

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="enrollments">Matrículas Manuais</TabsTrigger>
            <TabsTrigger value="coupons">Cupons de Desconto</TabsTrigger>
          </TabsList>

          {activeTab === "coupons" && (
            <Dialog open={isAddCouponOpen} onOpenChange={setIsAddCouponOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <Plus size={16} /> Novo Cupom
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Cupom</DialogTitle>
                </DialogHeader>
                <CouponForm 
                  onSubmit={(values) => {
                    addCoupon.mutate(values);
                    setIsAddCouponOpen(false);
                  }}
                  isSubmitting={addCoupon.isPending}
                />
              </DialogContent>
            </Dialog>
          )}

          {activeTab === "enrollments" && (
            <Dialog open={isAddEnrollmentOpen} onOpenChange={setIsAddEnrollmentOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <Plus size={16} /> Nova Matrícula
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Realizar Nova Matrícula</DialogTitle>
                </DialogHeader>
                <EnrollmentForm 
                  onSubmit={(values) => {
                    addEnrollment.mutate(values);
                    setIsAddEnrollmentOpen(false);
                  }}
                  isSubmitting={addEnrollment.isPending}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="mt-4">
          <TabsContent value="enrollments">
            <EnrollmentsTable 
              enrollments={enrollments} 
              isLoading={isLoadingEnrollments}
            />
          </TabsContent>
          
          <TabsContent value="coupons">
            <CouponsTable 
              coupons={coupons} 
              isLoading={isLoadingCoupons}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default EnrollmentManagement;
