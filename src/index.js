import core from '@actions/core';
import github from '@actions/github';
import semver from 'semver';

try {
  const prefix = core.getInput('prefix') || 'v';
  const ref = github.context.ref; // refs/tags/v1.2.3-beta.1
  const tagName = ref.replace(/^refs\/tags\//, '');

  if (!tagName.startsWith(prefix)) {
    throw new Error(`Tag '${tagName}' does not start with expected prefix '${prefix}'`);
  }

  const clean = tagName.slice(prefix.length); // Strip prefix
  const parsed = semver.parse(clean);

  if (!parsed) {
    throw new Error(`Invalid semver tag: ${clean}`);
  }

  // Determine npm tag
  let npmTag = 'latest';
  if (parsed.prerelease.length > 0) {
    npmTag = parsed.prerelease[0]; // e.g. 'beta' from 'beta.1'
  }
  const build = parsed.build.join('.').toString();
  const full = parsed.version.toString() + '+' +build;

  core.setOutput('npm_tag', npmTag);
  core.setOutput('version', parsed.version);
  core.setOutput('major', parsed.major.toString());
  core.setOutput('minor', parsed.minor.toString());
  core.setOutput('patch', parsed.patch.toString());
  core.setOutput('full',  full);
  core.setOutput('build', build);

  core.info(`Tag parsed: ${tagName} → ${parsed.version} (${npmTag})`);
} catch (err) {
  core.setFailed(err.message);
}
export default true;
