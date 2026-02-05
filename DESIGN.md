# Application Design

This document outlines the design principles, technology stack, and color palette for the B2B Marketplace application.

## Technology Stack

- **Frontend Framework:** React 18.2.0
- **Type Safety:** TypeScript 5.3.3
- **Build Tool:** Vite 5.0.8
- **Styling:** Tailwind CSS 3.3.6
- **Routing:** React Router DOM 6.20.0
- **HTTP Client:** Axios 1.6.2
- **Data Fetching & Caching:** TanStack Query 5.28.0
- **State Management:** React Context API + useReducer
- **Development Server:** Vite Dev Server

## Color Palette & Visual Design

| Color Name      | Hex       | Usage                                     |
| --------------- | --------- | ----------------------------------------- |
| **Primary**     | `#0D6EFD` | Buttons, links, and active UI elements.   |
| **Secondary**   | `#6C757D` | Secondary text and less important UI elements. |
| **Background**  | `#F8F9FA` | Main application background.              |
| **Surface**     | `#FFFFFF` | Background for cards, modals, and text areas. |
| **Text**        | `#212529` | Main text color.                          |
| **Accent**      | `#20c997` | Highlights, notifications, and special accents. |
| **Danger**      | `#DC3545` | Error messages and delete actions.        |

## Typography

- **Font Family:** System UI, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif.
- **Base Font Size:** 16px

## UI Principles

- **Minimalist:** The interface should be clean and uncluttered, focusing on the content.
- **Intuitive:** Users should be able to understand how to use the application without instruction.
- **Responsive:** The application should be fully functional and visually appealing on all screen sizes.
