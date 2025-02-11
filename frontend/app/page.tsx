'use client'

import * as React from "react";
import { ethers, ContractInterface } from 'ethers';
import Navbar from "@/components/header/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from 'next/navigation';
import HelloWorldAbi from '../contracts/hello.json'; // ABIのインポート

const HELLO_WORLD_CONTRACT_ADDRESS = '　';

// ABIの型を明示的に指定
const HELLO_WORLD_ABI: ContractInterface = HelloWorldAbi as ContractInterface; // 型を強制指定

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Component() {
  const [provider, setProvider] = React.useState<ethers.providers.Web3Provider | null>(null);
  const [message, setMessage] = React.useState<string>('');
  const [newMessage, setNewMessage] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      window.ethereum.request({ method: "eth_requestAccounts" });
    }
  }, []);

  const getContract = async () => {
    if (!provider) throw new Error("Ethereum provider not found");
    const signer = provider.getSigner();
    return new ethers.Contract(HELLO_WORLD_CONTRACT_ADDRESS, HELLO_WORLD_ABI, signer);
  };

  const fetchMessage = async () => {
    try {
      const contract = await getContract();
      const msg = await contract.message();
      setMessage(msg);
    } catch (error) {
      console.error("Error fetching message:", error);
    }
  };

  const updateMessage = async () => {
    try {
      setLoading(true);
      const contract = await getContract();
      const tx = await contract.setMessage(newMessage);
      await tx.wait();
      setMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error("Error updating message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">HelloWorld Contract</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Current Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={fetchMessage}>Fetch Message</Button>
            {message && (
              <Alert>
                <AlertTitle>Message</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            <Input
              type="text"
              placeholder="Enter new message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button onClick={updateMessage} disabled={loading}>
              {loading ? "Updating..." : "Update Message"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
