'use client'

import * as React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Navbar from "@/components/header/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from 'next/link';

const contractAddress = "YOUR_CONTRACT_ADDRESS";
const contractABI = [
  {
    "inputs": [],
    "name": "getOwner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
    "name": "changeOwner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default function HomePage() {
  const [owner, setOwner] = useState(null);
  const [newOwner, setNewOwner] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOwner = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const ownerAddress = await contract.getOwner();
      setOwner(ownerAddress);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const changeOwner = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const transaction = await contract.changeOwner(newOwner);
      await transaction.wait();
      fetchOwner();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOwner();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Navbar />
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome to Owner DApp</CardTitle>
          <CardDescription>Manage contract ownership on the blockchain.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg font-semibold">Current Owner: {owner || "Fetching..."}</div>
          <Input 
            type="text" 
            placeholder="Enter new owner address" 
            value={newOwner} 
            onChange={(e) => setNewOwner(e.target.value)}
          />
          <Button onClick={changeOwner} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Change Owner
          </Button>
          {error && <div className="text-destructive text-sm">{error}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
