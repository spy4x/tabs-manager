# Tabs Manager

Tabs Manager is a cloud-based solution to manage your browser tabs across multiple devices. This repository contains the source code for the frontend and backend components of the application.

## Features roadmap
✅ Real-time communication between frontend and backend using WebSockets
✅ Cloud-based storage that syncs between browsers
- Offline-first approach with in-browser DB
- Responsive and modern user interface with DaisyUI
✅ Type-safe ORM for Node.js using Prisma
- Easy setup and configuration using Docker
- Authentication 
    ✅ with Email and Password 
    - with Email Link 
    - with Google 
    - with GitHub 
    - with Facebook
- Links
    ✅ Create link
    ✅ List links
    - Update link
    - Delete link
    - Priority
    - Is favorite
    - Status (new, in progress, done-liked, done-disliked)
    - Private note
    - Parse Open Graph data
    - Filters
        - Read today mode (sorted by priority, then by createdAt)
        - Random mode
        - Favorites
        - Status
        - Priority
        - Tags
        - Folders
    - Search
        - by title (full text search)
        - by URL
        - by content
- Tags
    - Create tag
    - List tags
    - Update tag
    - Delete tag
    - Assign tag to link
    - Remove tag from link
    - Merge tags
- Folders
    - Create folder
    - List folders
    - Update folder
    - Delete folder
    - Assign folder to link
    - Remove folder from link
    - Nested
- Fast add & import
    - bookmarklet
    - import browser bookmarks
- Motivation to read/watch
- Browser extension
    - add links quick
    - show information about current url
        - status
        - private note
        - modify status
    - show unread links count
    - replace home page (new tab) with the web app or some motivational module
- PWA
    - to save urls quickly
    - offline mode
- Mobile wrapper for iPhone and Android
    - to save urls quickly
    - offline mode

## Development

```bash
pnpm install
pnpm dev
```

## Contributing

Contributions to the project are welcome and encouraged! You can contribute by submitting bug reports, feature requests, or pull requests to the GitHub repository.

## License

This project is licensed under the MIT License, which allows for free use, modification, and distribution of the code, as long as the original copyright notice and license are included.
