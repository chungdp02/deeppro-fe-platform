import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cn } from "@workspace/ui/lib/utils"

type SheetSide = "top" | "right" | "bottom" | "left"

const sideClasses: Record<SheetSide, string> = {
  top: "inset-x-0 top-0 border-b data-starting-style:-translate-y-full data-ending-style:-translate-y-full",
  right:
    "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm data-starting-style:translate-x-full data-ending-style:translate-x-full",
  bottom:
    "inset-x-0 bottom-0 border-t data-starting-style:translate-y-full data-ending-style:translate-y-full",
  left: "inset-y-0 left-0 h-full w-3/4 border-r data-starting-style:-translate-x-full data-ending-style:-translate-x-full sm:max-w-sm",
}

function Sheet(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger(props: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose(props: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/20 opacity-0 transition-opacity duration-300 data-open:opacity-100 data-starting-style:opacity-0 data-ending-style:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  side = "right",
  className,
  overlayClassName,
  ...props
}: DialogPrimitive.Popup.Props & {
  side?: SheetSide
  overlayClassName?: string
}) {
  return (
    <DialogPrimitive.Portal>
      <SheetOverlay className={overlayClassName} />
      <DialogPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed z-50 flex flex-col gap-4 bg-popover p-6 text-popover-foreground shadow-lg outline-none transition duration-300 ease-in-out",
          sideClasses[side],
          className
        )}
        {...props}
      />
    </DialogPrimitive.Portal>
  )
}

function SheetTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-base font-semibold", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
}
