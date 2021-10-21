import { getInput } from '@actions/core';
import { includes } from 'lodash-es';
import UnityVersionParser from './unity-version-parser';

class Input {
  static get testModes() {
    return ['all', 'playmode', 'editmode'];
  }

  static isValidFolderName(folderName) {
    const validFolderName = new RegExp(/^(\.|\.\/)?(\.?[\w~]+([_-]?[\w~]+)*\/?)*$/);

    return validFolderName.test(folderName);
  }

  static getFromUser() {
    // Input variables specified in workflow using "with" prop.
    const rawUnityVersion = getInput('unityVersion') || 'auto';
    const customImage = getInput('customImage') || '';
    const testMode = (getInput('testMode') || 'all').toLowerCase();
    const rawProjectPath = getInput('projectPath') || '.';
    const rawArtifactsPath = getInput('artifactsPath') || 'artifacts';
    const rawUseHostNetwork = getInput('useHostNetwork') || 'false';
    const customParameters = getInput('customParameters') || '';
    const sshAgent = getInput('sshAgent') || '';
    const githubToken = getInput('githubToken') || '';
    const checkName = getInput('checkName') || 'Test Results';
    const rawPackageMode = getInput('packageMode') || 'false';

    // Validate input
    if (!includes(this.testModes, testMode)) {
      throw new Error(`Invalid testMode ${testMode}`);
    }

    if (!this.isValidFolderName(rawArtifactsPath)) {
      throw new Error(`Invalid artifactsPath "${rawArtifactsPath}"`);
    }

    if (!this.isValidFolderName(rawProjectPath)) {
      throw new Error(`Invalid projectPath "${rawProjectPath}"`);
    }

    if (rawUseHostNetwork !== 'true' && rawUseHostNetwork !== 'false') {
      throw new Error(`Invalid useHostNetwork "${rawUseHostNetwork}"`);
    }

    if (rawPackageMode !== 'true' && rawPackageMode !== 'false') {
      throw new Error(`Invalid packageMode "${rawPackageMode}"`);
    }

    // Sanitise input
    const projectPath = rawProjectPath.replace(/\/$/, '');
    const artifactsPath = rawArtifactsPath.replace(/\/$/, '');
    const useHostNetwork = rawUseHostNetwork === 'true';
    const unityVersion =
      rawUnityVersion === 'auto' ? UnityVersionParser.read(projectPath) : rawUnityVersion;
    const packageMode = rawPackageMode === 'true';

    // Return sanitised input
    return {
      unityVersion,
      customImage,
      projectPath,
      testMode,
      artifactsPath,
      useHostNetwork,
      customParameters,
      sshAgent,
      githubToken,
      checkName,
      packageMode,
    };
  }
}

export default Input;
