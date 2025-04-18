import Level from "../models/Level.js";
import Module from "../models/Module.js";
import Question from "../models/Question.js";

export async function getQuestions(req, res) {
    try {
        const { levelIds, moduleIds } = req.body;

        if ((!levelIds || !Array.isArray(levelIds) || levelIds.length === 0) && (!moduleIds || !Array.isArray(moduleIds) || moduleIds.length === 0)) {
            return res.status(400).json({ message: 'Please provide an array of level IDs or module IDs.' });
        }

        const questions = await Question.find({ level: { $in: levelIds }, module: { $in: moduleIds } }).populate('level').populate('module').lean();
        res.status(200).json({
            message: 'Questions fetched successfully',
            data: questions
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching questions", erorr: error.message });
    }
}

export async function createQuestions(req, res) {
    try {
        const { questions } = req.body;

        if (!questions || questions.length === 0) {
            res.status(400).json({ message: 'Please provide an array of questions.' });
        }

        const allowedTypes = ["MCQ", "FIB", "TF"] // Multiple Choice Question, Fill in the Blank, True/False

        const invalidQuestions = questions.filter(q =>
            !q.module ||
            !q.type ||
            !allowedTypes.includes(q.type) ||
            !q.questionText ||
            !q.options ||
            !q.options.length === 0 ||
            !q.answer
        );

        if (invalidQuestions > 0) {
            return res.status(400).json({ message: 'Invalid or missing question fields.' });
        }

        const moduleIds = questions.map(q => q.module);
        const modules = await Module.find({ _id: { $in: moduleIds } }).lean();
        const moduleMap = new Map(modules.map(module => [module._id.toString(), module]));

        const invalidQuestionWithModules = questions.filter((q) => {
            if (!moduleMap.has(q.module.toString())) {
                return true;
            }
            return false;
        });

        if (invalidQuestionWithModules.length > 0) {
            return res.status(500).json({ message: 'Some modules do not exist.' });
        }

        const questionsWithLevel = questions.map(q => ({
            ...q,
            level: moduleMap.get(q.module.toString()).level
        }));

        const createdQuestions = await Question.insertMany(questionsWithLevel);

        res.status(201).json({
            message: 'Questions created successfully.',
            data: createdQuestions
        });
    } catch (error) {
        res.status(500).json({ message: '' });
    }
}