// Wallet store - manages wallet connection state
import { create } from 'zustand';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: bigint | null;
  setAddress: (address: string | null) => void;
  setConnected: (connected: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setBalance: (balance: bigint | null) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  isConnected: false,
  isConnecting: false,
  balance: null,
  
  setAddress: (address) => set({ address }),
  setConnected: (isConnected) => set({ isConnected }),
  setConnecting: (isConnecting) => set({ isConnecting }),
  setBalance: (balance) => set({ balance }),
  
  disconnect: () =>
    set({
      address: null,
      isConnected: false,
      isConnecting: false,
      balance: null,
    }),
}));
