'use client'

import * as React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Navbar from "@/components/header/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const contractAddress = "YOUR_CONTRACT_ADDRESS";
const contractABI = [
  {
    "inputs": [{ "internalType": "uint256", "name": "num", "type": "uint256" }],
    "name": "store",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "retrieve",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

export default function StoragePage() {
  const [value, setValue] = useState("");
  const [retrievedValue, setRetrievedValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const requestAccount = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else {
      alert("MetaMask is required!");
    }
  };

  const storeValue = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const transaction = await contract.store(value);
      await transaction.wait();
      setRetrievedValue(null); // Clear retrieved value
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const retrieveValue = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const value = await contract.retrieve();
      setRetrievedValue(value.toString());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Navbar />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Storage Contract</CardTitle>
          <CardDescription>Store and retrieve a number using Ethereum</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Input 
              type="number" 
              placeholder="Enter a number" 
              value={value} 
              onChange={(e) => setValue(e.target.value)}
            />
            <Button onClick={storeValue} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Store Value
            </Button>
          </div>
          <div className="space-y-4">
            <Button onClick={retrieveValue} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Retrieve Value
            </Button>
            {retrievedValue !== null && (
              <div className="text-xl font-semibold">Stored Value: {retrievedValue}</div>
            )}
          </div>
          {error && <div className="text-destructive text-sm">{error}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
