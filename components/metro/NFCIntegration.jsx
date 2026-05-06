import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CreditCard, Smartphone, QrCode, CheckCircle, AlertCircle, Clock, IndianRupee } from 'lucide-react';
import { useLanguage } from '../../lib/language-context';

const NFCIntegration = () => {
  const { t } = useLanguage();
  const [nfcSupported, setNfcSupported] = useState(false);
  const [nfcEnabled, setNfcEnabled] = useState(false);
  const [cardData, setCardData] = useState(null);
  const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, success, error
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [balance, setBalance] = useState(150.00);

  useEffect(() => {
    // Check NFC support
    if ('NDEFReader' in window) {
      setNfcSupported(true);
    }

    // Load mock transaction history
    loadTransactionHistory();
  }, []);

  const loadTransactionHistory = () => {
    const mockTransactions = [
      {
        id: '1',
        type: 'entry',
        station: 'Rajiv Chowk',
        amount: -10.00,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        line: 'Yellow'
      },
      {
        id: '2',
        type: 'exit',
        station: 'Karol Bagh',
        amount: 0.00,
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
        line: 'Blue'
      },
      {
        id: '3',
        type: 'topup',
        station: 'Online',
        amount: 100.00,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        line: null
      }
    ];
    setTransactionHistory(mockTransactions);
  };

  const startNFCScan = async () => {
    if (!nfcSupported) {
      setScanStatus('error');
      return;
    }

    try {
      setScanStatus('scanning');
      setCardData(null);

      // Simulate NFC reading delay
      setTimeout(() => {
        // Mock NFC card data
        const mockCardData = {
          cardNumber: 'DMRC-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          balance: balance,
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          cardType: 'Smart Card',
          lastUsed: new Date(),
          tripsToday: 3
        };

        setCardData(mockCardData);
        setScanStatus('success');

        // Auto-stop scanning after success
        setTimeout(() => {
          setScanStatus('idle');
        }, 3000);
      }, 2000);

    } catch (error) {
      console.error('NFC scan error:', error);
      setScanStatus('error');
    }
  };

  const simulatePayment = (amount, station, line) => {
    if (balance >= Math.abs(amount)) {
      setBalance(prev => prev + amount);

      // Add transaction to history
      const newTransaction = {
        id: Date.now().toString(),
        type: amount < 0 ? 'entry' : 'topup',
        station: station,
        amount: amount,
        timestamp: new Date(),
        line: line
      };

      setTransactionHistory(prev => [newTransaction, ...prev]);
      return true;
    }
    return false;
  };

  const quickTopUp = (amount) => {
    simulatePayment(amount, 'Online', null);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'entry': return <CreditCard className="w-4 h-4 text-red-500" />;
      case 'exit': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'topup': return <IndianRupee className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(Math.abs(amount));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t('nfc.title')}</h2>
          <p className="text-gray-600">{t('nfc.subtitle')}</p>
        </div>
        <Badge variant={nfcSupported ? "default" : "destructive"}>
          {nfcSupported ? t('nfc.supported') : t('nfc.notSupported')}
        </Badge>
      </div>

      {/* NFC Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            {t('nfc.cardReader')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                scanStatus === 'scanning' ? 'bg-blue-500 animate-pulse' :
                scanStatus === 'success' ? 'bg-green-500' :
                scanStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
              }`}></div>
              <span className="text-sm font-medium">
                {scanStatus === 'scanning' ? t('nfc.scanning') :
                 scanStatus === 'success' ? t('nfc.cardDetected') :
                 scanStatus === 'error' ? t('nfc.scanError') : t('nfc.readyToScan')}
              </span>
            </div>
            <Button
              onClick={startNFCScan}
              disabled={!nfcSupported || scanStatus === 'scanning'}
              variant={scanStatus === 'scanning' ? "secondary" : "default"}
            >
              {scanStatus === 'scanning' ? t('nfc.scanning') : t('nfc.scanCard')}
            </Button>
          </div>

          {cardData && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">{t('nfc.cardRead')}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">{t('nfc.cardNumber')}:</span>
                  <p className="font-mono font-medium">{cardData.cardNumber}</p>
                </div>
                <div>
                  <span className="text-gray-600">{t('nfc.balance')}:</span>
                  <p className="font-medium text-green-600">₹{cardData.balance.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-gray-600">{t('nfc.expiry')}:</span>
                  <p className="font-medium">{cardData.expiryDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">{t('nfc.tripsToday')}:</span>
                  <p className="font-medium">{cardData.tripsToday}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            {t('nfc.quickActions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[50, 100, 200, 500].map(amount => (
              <Button
                key={amount}
                variant="outline"
                onClick={() => quickTopUp(amount)}
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <IndianRupee className="w-4 h-4" />
                <span className="text-sm">₹{amount}</span>
              </Button>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              {t('nfc.topUpNote')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>{t('nfc.transactionHistory')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactionHistory.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium">
                      {transaction.type === 'topup' ? t('nfc.topUp') :
                       transaction.type === 'entry' ? `${t('nfc.entry')} - ${transaction.station}` :
                       `${t('nfc.exit')} - ${transaction.station}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {transaction.timestamp.toLocaleString()} • {transaction.line || 'Online'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {transaction.amount < 0 ? '-' : '+'}{formatAmount(transaction.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* NFC Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {t('nfc.howItWorks')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• {t('nfc.info1')}</p>
            <p>• {t('nfc.info2')}</p>
            <p>• {t('nfc.info3')}</p>
            <p>• {t('nfc.info4')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NFCIntegration;