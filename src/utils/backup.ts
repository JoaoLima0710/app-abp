import { db } from '../db/database';

export async function exportData() {
    const questions = await db.questions.toArray();
    const simulations = await db.simulations.toArray();
    const userProgress = await db.userProgress.toArray();

    const data = {
        version: 1,
        timestamp: new Date().toISOString(),
        data: {
            questions,
            simulations,
            userProgress
        }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `psiq-titulo-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export async function importData(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target?.result as string;
                const backup = JSON.parse(content);

                if (!backup.data || !backup.version) {
                    throw new Error('Formato de arquivo inválido');
                }

                await db.transaction('rw', db.questions, db.simulations, db.userProgress, async () => {
                    // Clear current data
                    await db.simulations.clear();
                    await db.userProgress.clear();

                    // Import new data
                    // Note: We don't clear questions to avoid losing static ones, 
                    // but we could upsert if the backup allows custom questions.
                    // For now, we restore progress/simulations.

                    if (backup.data.simulations.length > 0) {
                        await db.simulations.bulkAdd(backup.data.simulations);
                    }

                    if (backup.data.userProgress.length > 0) {
                        await db.userProgress.bulkAdd(backup.data.userProgress);
                    }
                });

                resolve(true);
            } catch (error) {
                console.error('Import error:', error);
                reject(error);
            }
        };
        reader.readAsText(file);
    });
}
