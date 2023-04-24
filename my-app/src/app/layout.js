import Navigation from "./components/Navigation";
import './styles/globals.css';

import { io } from "socket.io-client";

export const socket = io('http://localhost:4000');

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Consultorio 11 de Abril</title>
      </head>
      <body>
        <Navigation />
        {children}
      </body>
    </html >
  );
}