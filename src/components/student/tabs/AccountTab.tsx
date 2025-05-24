
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { preferencesService } from "@/utils/preferencesService";
import { toast } from "sonner";

const AccountTab = () => {
  const [savePreferences, setSavePreferences] = useState(true);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save user preference about saving preferences
    const userPrefs = preferencesService.getPreferences();
    if (!savePreferences) {
      // Clear preferences if user unchecked the box
      localStorage.removeItem('student_preferences');
      toast.success("Suas configurações foram atualizadas e as preferências foram apagadas");
    } else {
      toast.success("Suas configurações foram atualizadas");
    }
  };
  
  return (
    <>
      <h3 className="text-xl font-bold mb-4">Minha Conta</h3>
      <Card className="p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" defaultValue="José Silva" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue="jose@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" defaultValue="(11) 99999-9999" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthdate">Data de nascimento</Label>
              <Input id="birthdate" defaultValue="15/05/1990" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" defaultValue="Av. Paulista, 1000, São Paulo - SP" />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="save-preferences" 
              checked={savePreferences} 
              onCheckedChange={(checked) => setSavePreferences(checked as boolean)} 
            />
            <Label htmlFor="save-preferences">Salvar minhas preferências e configurações</Label>
          </div>
          
          <Button type="submit">Salvar alterações</Button>
        </form>
      </Card>
    </>
  );
};

export default AccountTab;
