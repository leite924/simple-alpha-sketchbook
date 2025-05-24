
import React from "react";
import { useClassManagement } from "./hooks/useClassManagement";
import ClassesTable from "./ClassesTable";
import ClassSearchBar from "./classes/ClassSearchBar";
import ClassFormDialog from "./classes/ClassFormDialog";

const ClassManagement = () => {
  const {
    isLoading,
    isEditing,
    currentClass,
    isDialogOpen,
    setIsDialogOpen,
    searchTerm,
    setSearchTerm,
    filteredClasses,
    handleSubmit,
    handleDelete,
    handleEdit,
    handleNewClass,
    resetAndCloseDialog
  } = useClassManagement();

  return (
    <div>
      <ClassSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNewClass={handleNewClass}
      />

      {isLoading ? (
        <div className="w-full flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ClassesTable 
          classes={filteredClasses} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      
      <ClassFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEditing={isEditing}
        currentClass={currentClass}
        onSubmit={handleSubmit}
        onCancel={resetAndCloseDialog}
      />
    </div>
  );
};

export default ClassManagement;
