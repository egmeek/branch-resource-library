var git = require("github"),
  request = require("request"),
  TarGz = require("tar.gz"),
  Config = require("config"),
  GitHub = new git({
    version: "3.0.0",
    debug: Config.mode === "debug",
    protocol: "https",
    host: "api.github.com",
    pathPrefix: "",
    timeout: 5000,
    headers: {
      "user-agent": Config.git.userAgent
    }
  });

class GithubTools {

  authenticateGitHub(oauthToken) {
    if (oauthToken == null) {
      // this is an application token, not an oauthToken
      GitHub.authenticate({ type: "token", token: Config.git.token })
    } else {
      GitHub.authenticate({ type: "oauth", token: oauthToken })
    }
  }

  getReleases(options) {
    return new Promise((resolve, reject) => {
      this.authenticateGitHub(options.oauthToken)
      GitHub.repos.getReleases({ owner: options.user, repo: options.repo })
        .then(releases => {
          resolve(releases.map(release => { return { id: release.id, tag: release.tag_name, download: release.tarball_url } }))
        })
    })
  }

  getReleaseFiles(release) {
    return new Promise((resolve, reject) => {
      let files = []

      const headers = {
        "accept-charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
        "accept-language": "en-US,en;q=0.8",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.13+ (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2",
        "accept-encoding": "gzip,deflate",
      }
      return options = {
        url: release.download,
        headers: headers
      }

      var read = request(options)
      var parse = TarGz().createParseStream()
      parse.on('entry', function (entry) {
        // regex to take out the first folder name
        const regex = /^[^\/]*\//
        files.push(entry.path.replace(regex, ""))
      });
      read.pipe(parse)
      parse.on('end', () => {
        resolve(files)
      })
    })
  }

  getReadme(options) {
    this.authenticateGitHub(options.oauthToken)
    const readmeHeaders = {
      accept: "application/vnd.github.VERSION.raw"
    }
    return GitHub.repos.getReadme({ owner: options.owner, repo: options.repo, headers: readmeHeaders })
  }

  getRepository(options) {
    this.authenticateGitHub(options.oauthToken)
    return GitHub.repos.get({ owner: options.owner, repo: options.repo })
  }

  getRepositories(options) {
    this.authenticateGitHub(options.oauthToken)
    return GitHub.repos.getAll({ user: options.user })
  }

  renderMarkdown(options) {
    return new Promise((resolve, reject) => {
      this.authenticateGitHub(options.oauthToken)
      GitHub.misc.renderMarkdownRaw(options.markdown)
        .then(htmlresult => resolve(htmlresult.data))
        .catch(reject)
    })
  }

  getAuthenticatedUser(options) {
    this.authenticateGitHub(options.oauthToken)
    return GitHub.users.get({})
  }

  search(options) {
    this.authenticateGitHub(options.oauthToken)
    return GitHub.search.repos({ q: options.query })
  }
}

module.exports = new GithubTools()