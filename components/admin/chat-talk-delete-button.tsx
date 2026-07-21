"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { deleteChatTalk } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export function ChatTalkDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, start] = React.useTransition();
  const [showModal, setShowModal] = React.useState(false);

  function handleConfirmDelete() {
    start(async () => {
      await deleteChatTalk(id);
      setShowModal(false);
      router.refresh();
    });
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
        onClick={() => setShowModal(true)}
        disabled={pending}
        title="Delete chat log"
        aria-label="Delete chat log"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin text-destructive" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>

      <ConfirmModal
        isOpen={showModal}
        title="Delete Chat Log?"
        description="Are you sure you want to delete this AI Chatbot conversation record permanently? This cannot be undone."
        confirmText="Delete Chat Record"
        isLoading={pending}
        onConfirm={handleConfirmDelete}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
