function ErrorFallback({ error, resetErrorBoundary }) {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '1rem' }}>
			<h1 style={{ color: 'red' }}>Something went wrong 🧐</h1>
			<p style={{ color: 'red' }}>{error.message}</p>
			<button style={{ padding: '1rem', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '0.5rem ' }} onClick={resetErrorBoundary}>Try again</button>
		</div>
	)
}

export default ErrorFallback;
