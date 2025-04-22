import React, { createContext, useState, useEffect } from 'react';

export const AssetsContext = createContext();

export const AssetsProvider = ({ children }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial assets
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        // Mock data for development
        const mockAssets = [
          { id: 1, name: 'Well A1', type: 'well', latitude: 40.1, longitude: -74.3, comments: 'Operational' },
          { id: 2, name: 'Motor B2', type: 'motor', latitude: 40.2, longitude: -74.4, comments: 'Needs maintenance' },
          { id: 3, name: 'Transformer C3', type: 'transformer', latitude: 40.0, longitude: -74.6, comments: '' }
        ];
        
        // In a real app, you would fetch from API:
        // const response = await axios.get('/api/assets');
        // const data = response.data;
        
        setAssets(mockAssets);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching assets:', err);
        setError('Failed to load assets');
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  // Add a new asset
  const addAsset = (newAsset) => {
    setAssets(prevAssets => [...prevAssets, newAsset]);
    
    // In a real app, you would also send to API:
    // await axios.post('/api/assets', newAsset);
  };

  // Update an existing asset
  const updateAsset = (updatedAsset) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => 
        asset.id === updatedAsset.id ? updatedAsset : asset
      )
    );
    
    // In a real app:
    // await axios.put(`/api/assets/${updatedAsset.id}`, updatedAsset);
  };

  // Delete an asset
  const deleteAsset = (assetId) => {
    setAssets(prevAssets => 
      prevAssets.filter(asset => asset.id !== assetId)
    );
    
    // In a real app:
    // await axios.delete(`/api/assets/${assetId}`);
  };

  return (
    <AssetsContext.Provider 
      value={{ 
        assets, 
        loading, 
        error, 
        addAsset, 
        updateAsset, 
        deleteAsset 
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
};