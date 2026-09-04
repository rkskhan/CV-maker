import React, { useState, useRef } from 'react';
import { CVData } from '../types/cv';
import { extractTextFromFile, parseCVTextToData } from '../utils/fileParser';
import { BLANK_CV } from '../data/sampleCV';
import { EditorPanel } from './EditorPanel';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Edit3,
  FilePlus,
  Plus
} from 'lucide-react';

interface PartOneCVSetupProps {
  cv: CVData;
  onUpdateCV: (newCV: CVData) => void;
  onNext: () => void;
  atsScore: number;
}

export const PartOneCVSetup: React.FC<PartOneCVSetupProps> = ({
  cv,
  onUpdateCV,
  onNext,
  atsScore,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      if (file.name.endsWith('.json')) {
        const text = await file.text();
        const parsed = JSON.parse(text);
        if (parsed.personalInfo && parsed.experience) {
          onUpdateCV(parsed);
          setUploadSuccess(`Imported JSON draft: "${file.name}"`);
        } else {
          throw new Error('Invalid JSON schema');
        }
      } else {
        const rawText = await extractTextFromFile(file);
        if (!rawText.trim()) {
          throw new Error('No readable text found in file. Please ensure it is not a scanned image PDF.');
        }
        const parsedCV = parseCVTextToData(rawText, file.name);
        onUpdateCV(parsedCV);
        setUploadSuccess(`Extracted & parsed: "${file.name}" (${parsedCV.experience.length} roles, ${parsedCV.education.length} schools, ${parsedCV.skillCategories.flatMap(c => c.skills).length} skills found)`);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to parse file. Please try a standard text-based PDF, DOCX, or JSON.');
    } finally {
      setIsUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Part 1 Introduction */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-black flex items-center justify-center">
                1
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                Step 1 of 3
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Upload CV or Create from Scratch
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Upload your existing PDF or DOCX file, or create a brand new ATS-ready CV from scratch.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Base ATS Score:
            </span>
            <span className="px-2.5 py-1 bg-green-50 text-green-700 font-bold text-xs rounded-full border border-green-200">
              {atsScore}%
            </span>
          </div>
        </div>

        {/* Dual Setup Methods: Upload vs Create from Scratch */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          {/* Method A: Upload Existing CV */}
          <div className="md:col-span-1 bg-slate-50/70 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-red-600" />
                  Option A: Upload Your CV
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  PDF or DOCX
                </span>
              </div>

              {/* Drag and drop zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-lg p-5 text-center transition-all ${
                  isDragOver
                    ? 'border-red-500 bg-red-50/50 scale-[1.01]'
                    : 'border-slate-300 hover:border-slate-400 bg-white'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={onFileChange}
                  accept=".pdf,.docx,.doc,.txt,.json"
                  className="hidden"
                />

                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <FileText className="w-5 h-5 text-slate-600" />
                </div>

                <p className="text-xs font-bold text-slate-800 mb-0.5">
                  {isUploading ? 'Extracting text...' : 'Click or drop your CV here'}
                </p>
                <p className="text-[11px] text-slate-500 mb-2">
                  Supports PDF, DOCX, and TXT
                </p>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded text-[11px] font-medium border border-slate-200">
                  <Upload className="w-3 h-3" />
                  <span>Choose File</span>
                </div>
              </div>

              {/* Feedback messages */}
              {uploadSuccess && (
                <div className="mt-3 p-2.5 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>{uploadSuccess}</span>
                </div>
              )}

              {uploadError && (
                <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Method B: Create New CV From Scratch */}
          <div className="md:col-span-1 bg-slate-50/70 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <FilePlus className="w-3.5 h-3.5 text-red-600" />
                  Option B: Create New CV From Scratch
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Start Blank
                </span>
              </div>

              {/* Interactive creation box */}
              <div
                id="btn-create-scratch"
                onClick={() => {
                  onUpdateCV(BLANK_CV);
                  setShowEditor(true);
                  setUploadSuccess('Created a new blank CV. Fill in your details below in the field editor.');
                  setUploadError(null);
                }}
                className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-lg p-5 text-center bg-white transition-all group"
              >
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-100 group-hover:bg-red-50 flex items-center justify-center text-slate-600 group-hover:text-red-600 transition-colors">
                  <FilePlus className="w-5 h-5" />
                </div>

                <p className="text-xs font-bold text-slate-800 mb-0.5">
                  Start with a clean blank CV
                </p>
                <p className="text-[11px] text-slate-500 mb-2">
                  Initialize empty ATS fields & edit manually
                </p>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black group-hover:bg-slate-900 text-white rounded text-[11px] font-medium transition-colors shadow-2xs">
                  <Plus className="w-3 h-3 text-red-500" />
                  <span>Create Blank CV</span>
                </div>
              </div>

              <div className="mt-3 p-2.5 bg-slate-100/80 border border-slate-200 rounded-lg text-xs text-slate-600">
                <p className="text-[11px] leading-relaxed">
                  Creates an empty, standard single-column ATS profile template ready for your contact information, employment history, and education.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified CV Overview & Optional Editor */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Current CV: {cv.personalInfo.fullName || 'Untitled Candidate'}
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">
                • {cv.personalInfo.jobTitle || 'No Title'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {cv.experience.length} Experience Roles • {cv.education.length} Degrees • {cv.skillCategories.flatMap(c => c.skills).length} Skills
            </p>
          </div>

          <button
            id="btn-toggle-editor"
            onClick={() => setShowEditor(!showEditor)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{showEditor ? 'Hide Field Editor' : 'Edit CV Details Manually'}</span>
            {showEditor ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Editor: keeps the UI clean and simple unless the user wants to tweak fields */}
        {showEditor ? (
          <div className="mt-4 pt-2">
            <EditorPanel cv={cv} onUpdateCV={onUpdateCV} />
          </div>
        ) : (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Ready to match!</span> You can proceed directly to match this CV against your target job posting in Step 2.
            </div>
            <button
              onClick={() => setShowEditor(true)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline transition-colors"
            >
              Want to edit any text before matching? Click here.
            </button>
          </div>
        )}
      </div>

      {/* Part 1 Bottom Navigation Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="text-xs text-slate-600 font-medium">
          Step 1 Complete: Your candidate profile is set.
        </div>

        <button
          id="btn-goto-part2"
          onClick={onNext}
          className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <span>Continue to Step 2: Target Job Description</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
