# Analytics Dashboard

A modern, responsive analytics dashboard built with Next.js, TypeScript, and Tailwind CSS. Features real-time data visualization, interactive charts, and a beautiful user interface.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with dark/light theme support
- **Real-time Analytics**: Live data updates and interactive charts
- **Advanced Filtering**: Comprehensive data filtering and search capabilities
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **TypeScript**: Full type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/analytics-dashboard.git
   cd analytics-dashboard
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Run the development server**:
   ```bash
   pnpm dev
   ```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Build for Production

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
analytics_dashboard_version19/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   ├── analytics-section.tsx
│   ├── charts-section.tsx
│   ├── dashboard-content.tsx
│   └── ...
├── lib/                    # Utility functions
├── hooks/                  # Custom React hooks
└── public/                 # Static assets
```

## 🎨 Components

- **Dashboard Content**: Main dashboard layout and structure
- **Analytics Section**: Key metrics and performance indicators
- **Charts Section**: Interactive data visualizations
- **Data Tables**: Sortable and filterable data displays
- **Advanced Filters**: Complex filtering and search functionality
- **Real-time Updates**: Live data streaming and updates

## 🌐 Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
- [Recharts](https://recharts.org/) for the charting library 