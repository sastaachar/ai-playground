import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { IconButton, Typography, Card, Tooltip } from '@mui/material';
import { CheckCircle, Error, ContentCopy, Replay } from '@mui/icons-material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import Grid from '@mui/material/Grid2';
import curlParser from 'curl-parser';


function convertHeaders(headersArray) {
    const headersObject = {};
    if (headersArray && Array.isArray(headersArray)) {
      headersArray.forEach((headerString) => {
        const [key, value] = headerString.split(":");
        if (key && value) {
          headersObject[key.trim()] = value.trim();
        }
      });
    }
    return headersObject;
  }
  

const parseCurl = (curl) => {
    try {
      const parsed = curlParser.parse_curl(curl);
      console.log("This is parsed $$$$$$$ ", parsed);
      return {
        method: parsed.method || 'GET',
        url: parsed.url || '',
        headers: parsed.headers || {},
        body: parsed.data || null
      };
      
    } catch (error) {
      console.error('Error parsing curl command:', error);
      return {
        method: 'GET',
        url: '',
        headers: {},
        body: null
      };
    }
  };

const CurlVisualizer = ({ curlCommand }) => {
  const [history, setHistory] = useState([]);
  const [activeEntry, setActiveEntry] = useState(null);
  const [editedCurl, setEditedCurl] = useState(curlCommand);
  const [responseTime, setResponseTime] = useState(0);
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('curlHistory');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    console.log(curlCommand);
    if (curlCommand) {
      setEditedCurl(curlCommand);
      executeRequest(curlCommand);
    }
  }, [curlCommand]);

  const executeRequest = async (curl) => {
    const start = Date.now();
    try {
      const { method, url, headers, body } = parseCurl(curl);
      console.log("This is method", method);
      console.log("This is url", url);
      console.log("This is headers", headers);
      console.log("This is body", body);
      const fetchHeaders = convertHeaders(headers);
      const response = await fetch(url, {
        method,
        headers: fetchHeaders,
        body: method !== 'GET' ? body : null
      });
      console.log("This is response", response);
      const data = await response.text();
      setResponseData(data);
      console.log("This is data", data);
      const newEntry = {
        id: uuidv4(),
        curl,
        parsed: { method, url, headers, body },
        response: {
          status: response.status,
          data: tryFormatJson(data),
          headers: Object.fromEntries(response.headers.entries())
        },
        timestamp: new Date().toISOString(),
        success: response.ok
      };

      setHistory(prev => {
        const updated = [newEntry, ...prev.slice(0, 9)];
        localStorage.setItem('curlHistory', JSON.stringify(updated));
        return updated;
      });

      setActiveEntry(newEntry.id);
      setResponseTime(Date.now() - start);
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const tryFormatJson = (str) => {
    try {
      return JSON.stringify(JSON.parse(str), null, 2);
    } catch {
      return str;
    }
  };

  return (
    <Grid container spacing={2} sx={{ p: 4, height: '100vh' }}>
      <Card sx={{ p: 3, overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Typography variant="h6">Request</Typography>
          <Tooltip title="Re-run">
            <IconButton onClick={() => executeRequest(editedCurl)}>
              <Replay />
            </IconButton>
          </Tooltip>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <Typography variant="body2" color="text.secondary">
              {responseTime}ms
            </Typography>
          </div>
        </div>

        <SyntaxHighlighter 
          language="bash"
          style={atomDark}
          contentEditable
          onBlur={(e) => setEditedCurl(e.target.textContent)}
        >
          {editedCurl}
        </SyntaxHighlighter>
      </Card>
      <Grid sx={{ width: '100%' }} container spacing={2}>
        <Grid size={8}>
        <Card sx={{ p: 3, overflow: 'scroll', backgroundColor: 'inherit' }}>
            {activeEntry && (
            <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                {history.find(e => e.id === activeEntry)?.success ? (
                    <CheckCircle color="success" />
                ) : (
                    <Error color="error" />
                )}
                <Typography variant="h6">
                    Response - {history.find(e => e.id === activeEntry)?.response.status}
                </Typography>
                <IconButton
                    sx={{ marginLeft: 'auto' }}
                    onClick={() => navigator.clipboard.writeText(
                    responseData
                    )}
                >
                    <ContentCopy />
                </IconButton>
                </div>
                <div style={{ overflowY: 'auto', maxHeight: '60vh' }}>
                    <SyntaxHighlighter
                    sx={{ overflowY: 'auto' }}
                    language="json"
                    style={atomDark}
                    showLineNumbers
                    >
                    {history.find(e => e.id === activeEntry)?.response.data || ''}
                    </SyntaxHighlighter>
                </div>
            </>
            )}
        </Card>
        </Grid>

        <Grid size={4}>
        <Card>
            <Typography variant="h6" gutterBottom color="text.secondary">History</Typography>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', maxHeight: '60vh', overflowX: 'hidden' }}>
            {history.map((entry) => (
                <motion.div
                key={entry.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                >
                <Card 
                    sx={{ 
                    width: '90%',
                    p: 2,
                    cursor: 'pointer',
                    backgroundColor: activeEntry === entry.id ? 'action.hover' : 'background.paper'
                    }}
                    onClick={() => setActiveEntry(entry.id)}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {entry.success ? (
                        <CheckCircle color="success" fontSize="small" />
                    ) : (
                        <Error color="error" fontSize="small" />
                    )}
                    <Typography variant="body2" sx={{ flex: 1 }} noWrap>
                        <strong>{entry.parsed.method}</strong> {entry.parsed.url}
                    </Typography>
                    <Typography variant="caption">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                    </Typography>
                    <Tooltip title="Copy cURL">
                        <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(entry.curl);
                        }}
                        >
                        <ContentCopy fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    </div>
                </Card>
                </motion.div>
            ))}
            </div>
        </Card>
        </Grid>
    </Grid>
    </Grid>
  );
};

export default CurlVisualizer;