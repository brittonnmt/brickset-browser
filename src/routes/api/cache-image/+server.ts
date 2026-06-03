import { json } from '@sveltejs/kit';
import { writeFile, mkdir, access } from 'fs/promises';
import { join } from 'path';
import type { RequestHandler } from './$types';

const IMAGES_DIR = join(process.cwd(), 'static', 'images');

export const POST: RequestHandler = async ({ request }) => {
	const { url, filename } = (await request.json()) as { url: string; filename: string };

	if (!url || !filename) {
		return json({ error: 'Missing url or filename' }, { status: 400 });
	}

	// Sanitize filename — allow only alphanumeric, dash, underscore, dot
	const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '');
	if (!safe) return json({ error: 'Invalid filename' }, { status: 400 });

	const dest = join(IMAGES_DIR, safe);

	// Already cached — no need to re-download
	try {
		await access(dest);
		return json({ cached: true, path: `/images/${safe}` });
	} catch {
		/* not cached yet */
	}

	try {
		await mkdir(IMAGES_DIR, { recursive: true });
		const res = await fetch(url);
		if (!res.ok) return json({ error: `Fetch failed: ${res.status}` }, { status: 502 });
		const buf = Buffer.from(await res.arrayBuffer());
		await writeFile(dest, buf);
		return json({ cached: true, path: `/images/${safe}` });
	} catch (err) {
		return json({ error: String(err) }, { status: 500 });
	}
};
