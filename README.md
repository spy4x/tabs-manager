# Tabs Manager

Tabs Manager is a cloud-based solution to manage your browser tabs across multiple devices. This repository contains the source code for the frontend and backend components of the application.

## Features roadmap
### Tech
✅ Cloud-based storage that syncs between browsers
✅ Type-safe ORM for Node.js using Prisma
- Offline-first approach with in-browser DB
    - Dixie.js
    - PouchDB
- Responsive and modern user interface with TailwindCSS and DaisyUI
- Deploy to ...
- Easy setup and configuration using Docker

### Features
- ✅ Authentication 
- Links
    ✅ Create link
        ✅ Attach tags
        - Create & attach tags
        - Attach folders
        - Create & attach folders
    ✅ List links
    - Update link
        - Add tag to link
        - Remove tag from link
        - Add folder to link
        - Remove folder from link
    - Delete link
    - Fields:
        ✅ Priority
        ✅ Is favorite
        - Status (new, in progress, done-liked, done-disliked)
        - Private note
        - Parse Open Graph data
        - Type
            - Article
            - Video
            - Website
    - Filters
        - Read today mode (sorted by priority, then by createdAt)
        - Random mode
        - Favorites
        - Status
        - Priority
        - Tags
        - Folders
    - Search
        - Full text search (title, description)
        - by URL
        - by content
- Tags
    ✅ Create tag
    ✅ List tags
    - Update tag
    - Delete tag
    - ? Merge tags
- Folders
    - Create folder
    - List folders
    - Update folder
    - Delete folder
    - Nested
- Fast add & import
    - bookmarklet
    - import browser bookmarks
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
- Profile
    - Change password
    - Forgot password
- Authentication 
    - with Google 
    - with GitHub 
    - with Facebook
- Settings
    - Show/hide tags
    - Show/hide folders
    - Show/hide status
    - Show/hide priority
    - Show/hide private note
    - Show/hide type
    - Show/hide read today mode
    - Show/hide random mode
    - Show/hide favorites
- Motivation to read/watch
- Mobile wrapper for iPhone and Android
    - to save urls quickly
    - offline mode

## Development

```bash
pnpm install
pnpm start
```

## Contributing

Contributions to the project are welcome and encouraged! You can contribute by submitting bug reports, feature requests, or pull requests to the GitHub repository.

## License

This project is licensed under the MIT License, which allows for free use, modification, and distribution of the code, as long as the original copyright notice and license are included.
