import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setConcurrency(null); // let Remotion choose based on CPU

// Use an existing Chromium when REMOTION_BROWSER is set (e.g. a network-restricted
// CI/cloud box where Remotion can't download its own headless Chrome). Unset → let
// Remotion manage its own browser. See .env.example.
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
