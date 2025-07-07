import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';
//import core from '@actions/core';
//import github from '@actions/github';

// Mock core and github

const mockData = {
  prefix: 'v',
  source: '',
};
const resetMockData = () => {
  mockData.prefix = 'v';
  mockData.source = '';
};
vi.mock('@actions/core', async (importOriginal) => {
  let origin = await importOriginal();
  let mock = {
    setOutput: vi.fn(),
    setFailed: vi.fn(),
    getInput: vi.fn().mockImplementation((name) => {
      return mockData[name];
    }),
    info: vi.fn(),
  };
  return {
    default: {
      ...origin,
      ...mock,
    },
  };
});

vi.mock('@actions/github', async (importOriginal) => {
  let origin = await importOriginal();
  let mock = {
    context: {
      ref: 'refs/tags/v1.2.3-beta.1',
    },
  };
  return {
    default: {
      ...origin,
      ...mock,
    },
  };
});

// Load the action file
const runAction = async () => await import(path.resolve(import.meta.dirname, '../src/index.js'));

describe('parse-tag action', () => {
  beforeEach(async (ctx) => {
    vi.clearAllMocks();
    vi.resetModules();
    const github = await import('@actions/github');
    const core = await import('@actions/core');
    ctx.github = github.default;
    ctx.core = core.default;
  });

  it('parses beta tag correctly', async ({ github, core }) => {
    github.context.ref = 'refs/tags/v1.2.3-beta.1+10.1';
    await runAction();

    expect(core.setOutput).toHaveBeenCalledWith('tag', 'beta');
    expect(core.setOutput).toHaveBeenCalledWith('version', '1.2.3-beta.1');
    expect(core.setOutput).toHaveBeenCalledWith('major', '1');
    expect(core.setOutput).toHaveBeenCalledWith('minor', '2');
    expect(core.setOutput).toHaveBeenCalledWith('patch', '3');
    expect(core.setOutput).toHaveBeenCalledWith('build', '10.1');
    expect(core.setOutput).toHaveBeenCalledWith('full', '1.2.3-beta.1+10.1');
  });

  it('parses stable tag as latest', async ({ github, core }) => {
    github.context.ref = 'refs/tags/v1.0.0';

    await runAction();

    expect(core.setOutput).toHaveBeenCalledWith('tag', 'latest');
    expect(core.setOutput).toHaveBeenCalledWith('version', '1.0.0');
  });

  it('fails on invalid tag', async ({ github, core }) => {
    github.context.ref = 'refs/tags/v1.invalid.tag';

    await runAction();

    expect(core.setFailed).toHaveBeenCalled();
  });

  it('respects custom prefix', async ({ github, core }) => {
    github.context.ref = 'refs/tags/release-2.3.4+10.1';

    //core.getInput = vi.fn().mockReturnValue('release-');
    mockData.prefix = 'release-';

    await runAction();
    resetMockData();

    expect(core.setOutput).toHaveBeenCalledWith('tag', 'latest');
    expect(core.setOutput).toHaveBeenCalledWith('version', '2.3.4');
    expect(core.setOutput).toHaveBeenCalledWith('build', '10.1');
  });

  it('fails if tag doesn’t match prefix', async ({ github, core }) => {
    github.context.ref = 'refs/tags/x1.2.3';
    //core.getInput = vi.fn().mockReturnValue('v');

    await runAction();

    expect(core.setFailed).toHaveBeenCalledWith(
      "Tag 'x1.2.3' does not start with expected prefix 'v'",
    );
  });

  it('respects custom source', async ({ github, core }) => {
    github.context.ref = 'refs/tags/x1.2.3';
    //core.getInput = vi.fn().mockReturnValue('package.json');
    mockData.source = 'package.json';

    await runAction();
    resetMockData();

    expect(core.setOutput).toHaveBeenCalledWith('tag', 'latest');
  });
});
