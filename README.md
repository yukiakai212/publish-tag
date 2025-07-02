# publish-tag

A GitHub Action that parses a Git tag (e.g. `v1.2.3-beta.1`) into a proper NPM publish tag (e.g. `beta`) and semantic version info.

Useful in CI/CD pipelines that publish to NPM with support for `latest`, `beta`, `alpha`, or `rc` tags automatically based on Git tag names.

---

## 🚀 Features

* 🔍 Parses GitHub semver tag like `v1.2.3-beta.1+10.1`
* 🏷 Outputs `tag` (e.g. `beta`, `latest`, etc.)
* 🔢 Also returns `version`, `major`, `minor`, `patch`, `build`, `full`
* ⚙️ Customizable prefix (`v`, `release-`, etc.)
* ❌ Fails on invalid or non-semver tags

---

## 📦 Outputs

| Output    | Description                                          |
| --------- | ---------------------------------------------------- |
| `tag`     | Tag for `npm publish` (`latest`, `beta`, `rc`, etc.) |
| `version` | Full semantic version parsed                         |
| `major`   | Major version number                                 |
| `minor`   | Minor version number                                 |
| `patch`   | Patch version number                                 |
| `build`   | Build version number                                 |
| `full`    | Full semantic version and build                      |

---

## 🔧 Inputs

| Input    | Description                                                  | Default |
| -------- | ------------------------------------------------------------ | ------- |
| `prefix` | Optional prefix to strip from Git tag (e.g. `v`, `release-`) | `v`     |

---

## 🧪 Example Usage

```yaml
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Parse Tag
        uses: yukiakaiorg/publish-tag@v1
        id: tag
        with:
          prefix: "v"

      - name: Publish to NPM
        run: npm publish --tag ${{ steps.tag.outputs.tag }}
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 📤 Examples

| Git Tag            | tag      | version      | major | minor | patch | build | Full               |
| ------------------ | -------- | ------------ | ----- | ----- | ----- | ----- | ------------------ |
| `v1.2.3`           | latest   | 1.2.3        | 1     | 2     | 3     |       | `1.2.3`            |
| `v2.0.0-beta.1`    | beta     | 2.0.0-beta.1 | 2     | 0     | 0     |       | `2.0.0-beta.1`     |
| `release-1.3.0`    | latest   | 1.3.0        | 1     | 3     | 0     |       | `1.3.0`            |
| `rel/1.0.0-rc.2`   | rc       | 1.0.0-rc.2   | 1     | 0     | 0     |       | `1.0.0-rc.2`       |
| `rel/1.0.0-rc.2`   | rc       | 1.0.0-rc.2   | 1     | 0     | 0     |       | `1.0.0-rc.2`       |
| `v1.0.0-beta+10.1` | beta     | 1.0.0-beta   | 1     | 0     | 0     | 10.1  | `1.0.0-beta+10.1`  |

---

## 📘 License

MIT License © 2025 Yuki
