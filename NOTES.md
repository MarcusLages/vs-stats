## GitHub API
- https://api.github.com
- We might have to use webhooks
- `octokit` node module to keep track of thatw

## Headers
- `Accept`: `application/vnd.github+json` or `application/json`
	- Add params: `application/vnd.github.<PARAM>+json`
- `X-GitHub-Api-Version`
- `User-Agent`: Identifies app/user making the request
	- #todo try using the project name (if it doesn't work, use github username)
- `Authorization`: `Bearer`/`token` to pass a token
	- JWT must be `Bearer`
    
## Conventions
- Use queue system for requests (no concurrent requests)
- Pay attention to the rate limit
	- Check header of response: `x-ratelimit-remaining` === 0
	- (future/do not worry) conditional requests to avoid rate limit
- Follow redirects

## Endpoints
- Use `octokit.rest`

## Auth
- Use authentication token

# VS Code
#### Track commits
- `vscode.git` extension

#### Track lines
- `vscode.workspace` subscription to live changes

#### Storing data
- ExtensionContext local storage for extensions
	- `context.globalState`
		- Overall hours
		- Weekly activity
	- `context.workspaceState`
		- Commits, lines and hours in project