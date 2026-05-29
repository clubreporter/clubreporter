import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PressPassVerificationDialog({
  open,
  onOpenChange,
  outletName,
  verificationInfo,
  onOutletNameChange,
  onVerificationInfoChange,
  onSubmit,
  busy = false,
}) {
  const canSubmit = Boolean(outletName?.trim() && verificationInfo?.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-black">Press Pass verification</DialogTitle>
          <DialogDescription className="text-sm">
            Tell us about your media outlet. We review applications within 24 hours.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-1">
          <div>
            <Label className="text-sm font-semibold">Media outlet name *</Label>
            <Input
              value={outletName}
              onChange={(e) => onOutletNameChange(e.target.value)}
              placeholder="e.g. Southern Star"
              className="mt-1 h-11"
              disabled={busy}
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Website or social media *</Label>
            <Input
              value={verificationInfo}
              onChange={(e) => onVerificationInfoChange(e.target.value)}
              placeholder="southernstar.ie or @southernstar"
              className="mt-1 h-11"
              disabled={busy}
            />
          </div>
          <Button
            className="w-full h-11 font-bold bg-[#1A9E6D] hover:bg-[#158f63]"
            disabled={!canSubmit || busy}
            onClick={onSubmit}
          >
            {busy ? 'Submitting…' : 'Submit application'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
