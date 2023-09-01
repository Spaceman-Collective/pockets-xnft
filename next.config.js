/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "shdw-drive.genesysgo.net",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "picsum.photos",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "madlads.s3.us-west-2.amazonaws.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "cdn.shyft.to",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "storage.googleapis.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "content.honey.land",
				port: "",
				pathname: "/**",
			},
		],
	},
}

module.exports = nextConfig
