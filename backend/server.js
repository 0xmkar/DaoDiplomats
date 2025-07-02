const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

const executeCommand = (command, args, workingDir) => {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      cwd: workingDir,
      stdio: 'pipe',
      shell: true
    });

    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, stdout, stderr, code });
      } else {
        reject({ success: false, stdout, stderr, code });
      }
    });

    process.on('error', (error) => {
      reject({ success: false, error: error.message });
    });
  });
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// Deploy swarm endpoint
app.post('/api/deploy-swarm', async (req, res) => {
  try {
    const { platform, hostingLocation, envVariables } = req.body;
    
    console.log('Received deploy request:', { platform, hostingLocation, envVariables });

    // Get the project root directory (parent of backend)
    const projectRoot = path.resolve(__dirname, '..');
    
    console.log('Project root:', projectRoot);
    console.log('Starting deployment process...');

    // Step 1: Run bun install
    console.log('Running bun install...');
    try {
      const installResult = await executeCommand('bun', ['install'], projectRoot);
      console.log('bun install completed successfully');
      console.log('Install output:', installResult.stdout);
    } catch (installError) {
      console.error('bun install failed:', installError);
      return res.status(500).json({
        success: false,
        message: 'Failed to install dependencies',
        error: installError.stderr || installError.error,
        step: 'install'
      });
    }

    console.log('Starting bun run dev...');
    try {
      const devProcess = spawn('bun', ['run', 'dev'], {
        cwd: projectRoot,
        stdio: 'pipe',
        shell: true,
        detached: true
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Development server started with PID:', devProcess.pid);

      res.json({
        success: true,
        message: 'Swarm deployed successfully!',
        details: {
          platform,
          hostingLocation,
          envVariables: envVariables.map(env => ({ name: env.name, value: '***' })), // Hide values
          processId: devProcess.pid,
          commands: ['bun install', 'bun run dev']
        }
      });

    } catch (devError) {
      console.error('bun run dev failed:', devError);
      return res.status(500).json({
        success: false,
        message: 'Failed to start development server',
        error: devError.stderr || devError.error,
        step: 'dev'
      });
    }

  } catch (error) {
    console.error('Deployment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during deployment',
      error: error.message
    });
  }
});

app.get('/api/processes', (req, res) => {
  res.json({
    message: 'Process information endpoint',
    note: 'Check your terminal for running processes'
  });
});

app.post('/api/stop-dev', async (req, res) => {
  try {
    const killResult = await executeCommand('pkill', ['-f', 'bun.*dev'], process.cwd());
    res.json({
      success: true,
      message: 'Development server stopped',
      details: killResult
    });
  } catch (error) {
    res.json({
      success: true,
      message: 'No development server processes found or already stopped'
    });
  }
});

app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /health - Health check');
  console.log('  POST /api/deploy-swarm - Deploy swarm');
  console.log('  GET  /api/processes - Get process info');
  console.log('  POST /api/stop-dev - Stop development server');
});
