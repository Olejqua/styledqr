# Shadcn Recipes For PrettyQR

PrettyQR is a primitive. These snippets show composition with shadcn/ui building blocks.

## Card + PrettyQR

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PrettyQR } from 'prettyqr/react';

export function PaymentCard() {
  return (
    <Card className='w-full max-w-sm'>
      <CardHeader>
        <CardTitle>Pay With QR</CardTitle>
      </CardHeader>
      <CardContent>
        <PrettyQR
          value='solana:merchant-wallet?amount=12.50'
          preset='rounded'
          className='w-full [&>svg]:w-full [&>svg]:h-auto'
          aria-label='Payment QR'
        />
      </CardContent>
    </Card>
  );
}
```

## Dialog + PrettyQR

```tsx
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PrettyQR } from 'prettyqr/react';

export function QrDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open QR</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Scan To Pay</DialogTitle>
        </DialogHeader>
        <PrettyQR
          value='https://example.com/pay/checkout-id'
          preset='rounded'
          className='w-full [&>svg]:w-full [&>svg]:h-auto'
          aria-label='Checkout QR'
        />
      </DialogContent>
    </Dialog>
  );
}
```

## Tabs + PrettyQR

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PrettyQR } from 'prettyqr/react';

export function NetworkTabs() {
  return (
    <Tabs defaultValue='solana' className='w-full max-w-md'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='solana'>Solana</TabsTrigger>
        <TabsTrigger value='ethereum'>Ethereum</TabsTrigger>
      </TabsList>

      <TabsContent value='solana'>
        <PrettyQR
          value='solana:merchant-wallet'
          preset='rounded'
          className='w-full [&>svg]:w-full [&>svg]:h-auto'
          aria-label='Solana QR'
        />
      </TabsContent>

      <TabsContent value='ethereum'>
        <PrettyQR
          value='ethereum:0x1234...abcd'
          preset='default'
          className='w-full [&>svg]:w-full [&>svg]:h-auto'
          aria-label='Ethereum QR'
        />
      </TabsContent>
    </Tabs>
  );
}
```
