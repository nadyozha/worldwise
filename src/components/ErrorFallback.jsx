function ErrorFallback({ error, resetErrorBoundary }) {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
			<h1>Something went wrong 🧐</h1>
			<p>{error.message}</p>
			<button onClick={resetErrorBoundary}>Try again</button>
		</div>
	)
}

export default ErrorFallback;
