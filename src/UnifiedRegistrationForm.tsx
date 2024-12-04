import { useRouter } from 'next/router';

function MyComponent() {
  const router = useRouter();

  return (
    <div>
      <h1>My Component</h1>
      <button onClick={() => router.push('/')}>Go Home</button>
    </div>
  );
}

export default MyComponent;

