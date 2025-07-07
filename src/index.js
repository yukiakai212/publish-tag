import core from '@actions/core';
import fs from 'node:fs';
import github from '@actions/github';
import semver from 'semver';

try {
  const getData = () => {
    const source = core.getInput('source');
    let tagName;
    let prefix;
    if (source) {
      tagName = JSON.parse(fs.readFileSync(source)).version;
      prefix = '';
    } else {
      const ref = github.context.ref; // refs/tags/v1.2.3-beta.1
      tagName = ref.replace(/^refs\/tags\//, '');
      prefix = core.getInput('prefix') || 'v';
    }
    return { tagName, prefix };
  };
  const { tagName, prefix } = getData();

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
  const full = parsed.version.toString() + '+' + build;

  core.setOutput('tag', npmTag);
  core.setOutput('version', parsed.version);
  core.setOutput('major', parsed.major.toString());
  core.setOutput('minor', parsed.minor.toString());
  core.setOutput('patch', parsed.patch.toString());
  core.setOutput('full', full);
  core.setOutput('build', build);

  core.info(`Tag parsed: ${tagName} → ${parsed.version} (${npmTag})`);
} catch (err) {
  //console.log(err);
  core.setFailed(err.message);
}
export default true;
